import siteConfig from "./src/lib/config";

const config = siteConfig({
	title: "Icho's Blog",
	prologue: "记录学习、折腾与思考。",
	author: {
		name: "Ichooooooo",
		link: "https://github.com/Ichooooooo"
	},
	description: "Ichooooooo 的个人博客，记录计算机科学、Linux 与开发实践。",
	copyright: {
		type: "CC BY-NC-ND 4.0",
		year: "2026"
	},
	timezone: "Asia/Shanghai",
	i18n: {
		locales: ["zh-cn", "en", "ja"],
		defaultLocale: "zh-cn"
	},
	pagination: {
		note: 10,
		jotting: 24
	},
	heatmap: {
		unit: "day",
		weeks: 20
	},
	feed: {
		section: "*",
		limit: 20
	},
	latest: "*"
});

export const monolocale = Number(config.i18n.locales.length) === 1;

export default config;
