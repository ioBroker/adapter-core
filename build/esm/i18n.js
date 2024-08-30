import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
let language = "en";
let words = null;
// Init internationalization
export async function init(
/** The root directory of the adapter */
rootDir, 
/** The adapter instance or the language to use */
langOrAdmin) {
    if (langOrAdmin && typeof langOrAdmin === "object") {
        const adapter = langOrAdmin;
        const systemConfig = await adapter.getForeignObjectAsync("system.config");
        if (systemConfig?.common.language) {
            language = systemConfig?.common.language;
        }
    }
    else if (typeof langOrAdmin === "string") {
        language = langOrAdmin;
    }
    let files;
    if (existsSync(join(rootDir, "i18n"))) {
        files = readdirSync(join(rootDir, "i18n"));
    }
    else if (existsSync(join(rootDir, "lib/i18n"))) {
        files = readdirSync(join(rootDir, "lib/i18n"));
    }
    else {
        throw new Error("Cannot find i18n directory");
    }
    words = {};
    files.forEach((file) => {
        if (file.endsWith(".json")) {
            const lang = file.split(".")[0];
            const wordsForLanguage = JSON.parse(readFileSync(join(rootDir, `/i18n/${file}`)).toString("utf8"));
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
        throw new Error("i18n not initialized. Please call 'init(adapter)' before");
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
        throw new Error("i18n not initialized. Please call 'init(adapter)' before");
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
