import siteConfig from "./src/lib/config";

const config = siteConfig({
	title: "icovo",
	prologue: "Eyes are raining for her \n heart is holding umbrella for her, this is Love",
	author: {
		name: "icovo",
		link: "https://github.com/Ichooooooo"
	},
	description: "icovo 的个人博客，记录日常生活，学习",
	copyright: {
		type: "CC BY-NC-ND 4.0",
		year: "2026"
	},
	timezone: "Asia/Shanghai",
	i18n: {
		locales: ["zh-cn"],
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
