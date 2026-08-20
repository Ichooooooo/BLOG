import fs from "node:fs";
import path from "node:path";

// Directory to cache downloaded fonts
const CACHE_DIR = path.resolve(process.cwd(), "node_modules", ".cache", "og-fonts");

// Locale-specific font URLs
const fonts: Record<string, string> = {
	en: "https://cdn.jsdelivr.net/gh/notofonts/notofonts.github.io/fonts/NotoSerif/unhinted/otf/NotoSerif-Bold.otf",
	"zh-cn": "https://raw.githubusercontent.com/adobe-fonts/source-han-serif/release/OTF/SimplifiedChinese/SourceHanSerifSC-Bold.otf",
	ja: "https://raw.githubusercontent.com/adobe-fonts/source-han-serif/release/OTF/Japanese/SourceHanSerif-Bold.otf"
};

const DOWNLOAD_ATTEMPTS = 3;

async function downloadFont(url: string) {
	let lastError: unknown;

	for (let attempt = 1; attempt <= DOWNLOAD_ATTEMPTS; attempt += 1) {
		try {
			const response = await fetch(url);
			if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
			return response.arrayBuffer();
		} catch (error) {
			lastError = error;
			if (attempt < DOWNLOAD_ATTEMPTS) await new Promise(resolve => setTimeout(resolve, attempt * 1000));
		}
	}

	throw new Error(`Failed to load font from ${url} after ${DOWNLOAD_ATTEMPTS} attempts`, { cause: lastError });
}

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

/**
 * Load font for the specified locale, downloading and caching it if necessary.
 * @param locale locale code
 * @returns ArrayBuffer of the font data
 */
export async function loadFont(locale: string) {
	const url = fonts[locale];
	if (!url) throw new Error(`No font URL found for locale: ${locale}`);

	const fileName = path.basename(url);
	const filePath = path.join(CACHE_DIR, fileName);

	if (fs.existsSync(filePath)) return fs.promises.readFile(filePath).then(buffer => buffer.buffer);

	const buffer = await downloadFont(url);
	await fs.promises.writeFile(filePath, new Uint8Array(buffer));

	return buffer;
}
