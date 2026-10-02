import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

let language: ioBroker.Languages = 'en';
let words: null | Record<string, ioBroker.Translated> = null;

/**
 * Init internationalization
 *
 * @param rootDir The path, where i18n directory is located
 * @param languageOrAdapter The adapter instance or the language to use
 */
export async function init(rootDir: string, languageOrAdapter: ioBroker.Adapter | ioBroker.Languages): Promise<void> {
    let adapter: ioBroker.Adapter | undefined;
    if (languageOrAdapter && typeof languageOrAdapter === 'object') {
        adapter = languageOrAdapter;
        const systemConfig = await adapter.getForeignObjectAsync('system.config');
        if (systemConfig?.common.language) {
            language = systemConfig?.common.language;
        }
    } else {
        language = languageOrAdapter;
    }

    let files: string[];
    if (existsSync(join(rootDir, 'i18n'))) {
        files = readdirSync(join(rootDir, 'i18n'));
    } else if (existsSync(join(rootDir, 'lib', 'i18n'))) {
        // if iobroker.adapter folder and in it exists lib/i18n
        rootDir = join(rootDir, 'lib');
        files = readdirSync(join(rootDir, 'i18n'));
    } else {
        throw new Error(`Cannot find i18n directory in "${join(rootDir, 'i18n')}", "${join(rootDir, 'lib', 'i18n')}"`);
    }

    words = {};

    let count = 0;
    files.forEach((file: string) => {
        if (file.endsWith('.json')) {
            count++;
            const lang: ioBroker.Languages = file.split('.')[0] as ioBroker.Languages;
            const wordsForLanguage = JSON.parse(readFileSync(join(rootDir, 'i18n', file)).toString('utf8'));
            Object.keys(wordsForLanguage).forEach((key: string) => {
                if (words) {
                    if (!words[key]) {
                        words[key] = {} as ioBroker.Translated;
                    }
                    words[key][lang] = wordsForLanguage[key];
                }
            });
        }
    });

    if (!count) {
        // may be it is an old structure: i18n/lang/translation.json
        files.forEach((file: string) => {
            if ((file.match(/^[a-z]{2}$/) || file === 'zh-cn') && statSync(join(rootDir, 'i18n', file)).isDirectory()) {
                if (adapter) {
                    adapter.log.warn(
                        'Looks like you use old structure of i18n. ' +
                            'Please switch to 1i8n/lang.json instead of i18n/lang/translation.json',
                    );
                }
                const lang: ioBroker.Languages = file as ioBroker.Languages;
                if (existsSync(join(rootDir, 'i18n', lang, 'translations.json'))) {
                    const wordsForLanguage = JSON.parse(
                        readFileSync(join(rootDir, 'i18n', lang, 'translations.json')).toString('utf8'),
                    );
                    Object.keys(wordsForLanguage).forEach((key: string) => {
                        if (words) {
                            if (!words[key]) {
                                words[key] = {} as ioBroker.Translated;
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
 * Replace the `%s` placeholders of a text with the arguments, in order
 *
 * @param text Text with placeholders
 * @param args Values for the placeholders
 */
function fillPlaceholders(text: string, args: (string | number | boolean | null)[]): string {
    for (const arg of args) {
        // A function as replacement: `$&`, `$1` and the like in a value are not read as replacement patterns
        text = text.replace('%s', () => (arg === null ? 'null' : arg.toString()));
    }
    return text;
}

/**
 * Get translation as one string
 *
 * @param key Word to translate
 * @param args Optional parameters to replace %s
 */
export function translate(key: string, ...args: (string | number | boolean | null)[]): string {
    if (!words) {
        throw new Error("i18n not initialized. Please call 'init(__dirname, adapter)' before");
    }
    let text: string;
    if (!words[key]) {
        text = key;
    } else {
        text = words[key][language] || words[key].en || key;
    }
    return fillPlaceholders(text, args);
}

/** Alias shortcut for translate function */
export const t = translate;

/**
 * Get translation as ioBroker.Translated object
 *
 * @param key Word to translate
 * @param args Optional parameters to replace %s
 */
export function getTranslatedObject(key: string, ...args: (string | number | boolean | null)[]): ioBroker.Translated {
    if (!words) {
        throw new Error("i18n not initialized. Please call 'init(__dirname, adapter)' before");
    }

    const word: Record<string, string> = words[key] || { en: key };
    const result: Record<string, string> = {};
    for (const lang of Object.keys(word)) {
        result[lang] = fillPlaceholders(word[lang], args);
    }
    return result as ioBroker.Translated;
}

export default {
    init,
    translate,
    getTranslatedObject,
    t,
};
