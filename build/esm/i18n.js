import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
let language = 'en';
let words = null;
/** The i18n directory each key of the module-level table came from first, to name a collision. */
const keySource = new Map();
/** i18n directories whose collisions were already reported — one warning per pair of directories. */
const reportedCollisions = new Set();
/**
 * Read the words of one i18n directory.
 *
 * @param rootDir The path, where i18n directory is located
 * @param adapter The adapter instance, if given, for the warning about the old structure
 * @returns the words of the directory and the directory they were read from
 */
function readWords(rootDir, adapter) {
    let files;
    if (existsSync(join(rootDir, 'i18n'))) {
        files = readdirSync(join(rootDir, 'i18n'));
    }
    else if (existsSync(join(rootDir, 'lib', 'i18n'))) {
        // if iobroker.adapter folder and in it exists lib/i18n
        rootDir = join(rootDir, 'lib');
        files = readdirSync(join(rootDir, 'i18n'));
    }
    else {
        throw new Error(`Cannot find i18n directory in "${join(rootDir, 'i18n')}", "${join(rootDir, 'lib', 'i18n')}"`);
    }
    const table = {};
    const add = (lang, wordsForLanguage) => {
        Object.keys(wordsForLanguage).forEach((key) => {
            if (!table[key]) {
                table[key] = {};
            }
            table[key][lang] = wordsForLanguage[key];
        });
    };
    let count = 0;
    files.forEach((file) => {
        if (file.endsWith('.json')) {
            count++;
            const lang = file.split('.')[0];
            add(lang, JSON.parse(readFileSync(join(rootDir, 'i18n', file)).toString('utf8')));
        }
    });
    if (!count) {
        // may be it is an old structure: i18n/lang/translation.json
        files.forEach((file) => {
            if ((file.match(/^[a-z]{2}$/) || file === 'zh-cn') && statSync(join(rootDir, 'i18n', file)).isDirectory()) {
                if (adapter) {
                    adapter.log.warn('Looks like you use old structure of i18n. ' +
                        'Please switch to 1i8n/lang.json instead of i18n/lang/translation.json');
                }
                const lang = file;
                if (existsSync(join(rootDir, 'i18n', lang, 'translations.json'))) {
                    add(lang, JSON.parse(readFileSync(join(rootDir, 'i18n', lang, 'translations.json')).toString('utf8')));
                }
            }
        });
    }
    return { table, dir: join(rootDir, 'i18n') };
}
/**
 * Replace the `%s` placeholders of a text with the arguments, in order
 *
 * @param text Text with placeholders
 * @param args Values for the placeholders
 */
function fillPlaceholders(text, args) {
    for (const arg of args) {
        // A function as replacement: `$&`, `$1` and the like in a value are not read as replacement patterns
        text = text.replace('%s', () => (arg === null ? 'null' : arg.toString()));
    }
    return text;
}
/**
 * Translate one key from a table.
 *
 * @param table the words
 * @param lang the language
 * @param key Word to translate
 * @param args Optional parameters to replace %s
 * @returns the text
 */
function translateFrom(table, lang, key, args) {
    let text;
    if (!table[key]) {
        text = key;
    }
    else {
        text = table[key][lang] || table[key].en || key;
    }
    return fillPlaceholders(text, args);
}
/**
 * Get the ioBroker.Translated object of one key from a table.
 *
 * @param table the words
 * @param key Word to translate
 * @param args Optional parameters to replace %s
 * @returns the translations
 */
function translatedObjectFrom(table, key, args) {
    const word = table[key] || { en: key };
    const result = {};
    for (const lang of Object.keys(word)) {
        result[lang] = fillPlaceholders(word[lang], args);
    }
    return result;
}
/**
 * Init internationalization.
 *
 * In compact mode js-controller requires the main file of every adapter of a compact group into one process, so
 * adapters that resolve the same installed adapter-core share this module. The module-level `translate`, `t` and
 * `getTranslatedObject` carry no caller, so they cannot tell the adapters apart: every `init` adds its words to one
 * table, and a key that two adapters translate differently answers with the text of the last `init` (a warning names
 * both directories). The translator returned here holds only the words and the language of this `init` — use it
 * where several adapters can run in one process.
 *
 * @param rootDir The path, where i18n directory is located
 * @param languageOrAdapter The adapter instance or the language to use
 * @returns the translator of this adapter
 */
export async function init(rootDir, languageOrAdapter) {
    let adapter;
    let ownLanguage = 'en';
    if (languageOrAdapter && typeof languageOrAdapter === 'object') {
        adapter = languageOrAdapter;
        const systemConfig = await adapter.getForeignObjectAsync('system.config');
        if (systemConfig?.common.language) {
            ownLanguage = systemConfig?.common.language;
        }
    }
    else {
        ownLanguage = languageOrAdapter;
    }
    language = ownLanguage;
    const { table, dir } = readWords(rootDir, adapter);
    // Merge into the module-level table, never replace it: a second adapter in the same process must not take the
    // words of the first.
    if (!words) {
        words = {};
    }
    for (const key of Object.keys(table)) {
        const before = keySource.get(key);
        if (before && before !== dir && JSON.stringify(words[key]) !== JSON.stringify(table[key])) {
            const pair = `${before}\n${dir}`;
            if (!reportedCollisions.has(pair)) {
                reportedCollisions.add(pair);
                const text = `I18n: "${key}" is translated differently in ${before} and ${dir}; the module-level translate ` +
                    'answers with the last init — use the translator returned by init to keep the words of each adapter';
                if (adapter) {
                    adapter.log.warn(text);
                }
                else {
                    console.warn(text);
                }
            }
        }
        if (!before) {
            keySource.set(key, dir);
        }
        words[key] = table[key];
    }
    const translate = (key, ...args) => translateFrom(table, ownLanguage, key, args);
    return {
        translate,
        t: translate,
        getTranslatedObject: (key, ...args) => translatedObjectFrom(table, key, args),
    };
}
/**
 * Get translation as one string
 *
 * @param key Word to translate
 * @param args Optional parameters to replace %s
 */
export function translate(key, ...args) {
    if (!words) {
        throw new Error("i18n not initialized. Please call 'init(__dirname, adapter)' before");
    }
    return translateFrom(words, language, key, args);
}
/** Alias shortcut for translate function */
export const t = translate;
/**
 * Get translation as ioBroker.Translated object
 *
 * @param key Word to translate
 * @param args Optional parameters to replace %s
 */
export function getTranslatedObject(key, ...args) {
    if (!words) {
        throw new Error("i18n not initialized. Please call 'init(__dirname, adapter)' before");
    }
    return translatedObjectFrom(words, key, args);
}
export default {
    init,
    translate,
    getTranslatedObject,
    t,
};
