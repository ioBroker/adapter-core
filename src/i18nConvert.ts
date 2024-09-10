import { existsSync, readdirSync, renameSync, unlinkSync } from "node:fs";
import { join } from "node:path";

// convert i18n/lang/translations.json to i18n/lang.json
function convert(rootDir: string): void {
	if (existsSync(join(rootDir, "i18n"))) {
		rootDir = join(rootDir, "i18n");
	} else if (existsSync(join(rootDir, "lib", "i18n"))) {
		rootDir = join(rootDir, "lib", "i18n");
	} else if (existsSync(join(rootDir, "admin", "i18n"))) {
		rootDir = join(rootDir, "admin", "i18n");
	} else if (rootDir.endsWith("i18n")) {
		// already the correct directory
	}

	const langs = readdirSync(rootDir);

	for (const lang of langs) {
		if (
			(lang.match(/^[a-z]{2}$/) || lang === "zh-cn") &&
			existsSync(join(rootDir, lang, "translations.json"))
		) {
			renameSync(
				join(rootDir, lang, "translations.json"),
				join(rootDir, `${lang}.json`),
			);
			unlinkSync(join(rootDir, lang));
		}
	}
}

if (process.argv.length < 3) {
	console.warn("Usage: node i18nConvert <path>");
	convert(".");
} else {
	convert(process.argv[2]);
}
