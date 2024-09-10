import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
let language = "en";
let words = null;
// Init internationalization
export async function init(
/** The root directory of the adapter */
rootDir, 
/** The adapter instance or the language to use */
languageOrAdapter) {
    let adapter;
    if (languageOrAdapter && typeof languageOrAdapter === "object") {
        adapter = languageOrAdapter;
        const systemConfig = await adapter.getForeignObjectAsync("system.config");
        if (systemConfig?.common.language) {
            language = systemConfig?.common.language;
        }
    }
    else if (typeof languageOrAdapter === "string") {
        language = languageOrAdapter;
    }
    let files;
    if (existsSync(join(rootDir, "i18n"))) {
        files = readdirSync(join(rootDir, "i18n"));
    }
    else if (existsSync(join(rootDir, "lib", "i18n"))) {
        rootDir = join(rootDir, "lib");
        files = readdirSync(join(rootDir, "i18n"));
    }
    else {
        throw new Error("Cannot find i18n directory");
    }
    words = {};
    let count = 0;
    files.forEach((file) => {
        if (file.endsWith(".json")) {
            count++;
            const lang = file.split(".")[0];
            const wordsForLanguage = JSON.parse(readFileSync(join(rootDir, "i18n", file)).toString("utf8"));
            Object.keys(wordsForLanguage).forEach((key) => {
                if (words) {
                    if (!words[key]) {
                        words[key] = {};
                    }
                    words[key][lang] = wordsForLanguage[key];
                }
            });
        }
    });
    if (!count) {
        // may be it is an old structure: i18n/lang/translation.json
        files.forEach((file) => {
            if ((file.match(/^[a-z]{2}$/) || file === "zh-cn") &&
                statSync(join(rootDir, "i18n", file)).isDirectory()) {
                if (adapter) {
                    adapter.log.warn("Looks like you use old structure of i18n. " +
                        "Please switch to 1i8n/lang.json instead of i18n/lang/translation.json");
                }
                const lang = file;
                if (existsSync(join(rootDir, "i18n", lang, "translations.json"))) {
                    const wordsForLanguage = JSON.parse(readFileSync(join(rootDir, "i18n", lang, "translations.json")).toString("utf8"));
                    Object.keys(wordsForLanguage).forEach((key) => {
                        if (words) {
                            if (!words[key]) {
                                words[key] = {};
                            }
                            words[key][lang] = wordsForLanguage[key];
                        }
                    });
                }
            }
        });
    }
}
/**
 * Get translation as one string
 */
export function t(
/** Word to translate */
key, 
/** Optional parameters to replace %s */
...args) {
    if (!words) {
        throw new Error("i18n not initialized. Please call 'init(__dirname, adapter)' before");
    }
    if (!words[key]) {
        return key;
    }
    let text = words[key][language] || words[key].en || key;
    if (args.length) {
        for (let i = 0; i < args.length; i++) {
            text = text.replace("%s", 
            // @ts-expect-error No idea why args[i] is not accepted here
            args[i] === null ? "null" : args[i].toString());
        }
    }
    return text;
}
/**
 * Get translation as ioBroker.Translated object
 */
export function tt(
/** Word to translate */
key, 
/** Optional parameters to replace %s */
...args) {
    if (!words) {
        throw new Error("i18n not initialized. Please call 'init(__dirname, adapter)' before");
    }
    if (words[key]) {
        if (words[key].en && words[key].en.includes("%s")) {
            const result = {};
            Object.keys(words[key]).forEach((lang) => {
                for (let i = 0; i < args.length; i++) {
                    result[lang] =
                        // @ts-expect-error words[key] cannot be null
                        words[key][lang].replace("%s", 
                        // @ts-expect-error No idea why args[i] is not accepted here
                        args[i] === null ? "null" : args[i].toString());
                }
            });
            return result;
        }
        return words[key];
    }
    return key;
}
