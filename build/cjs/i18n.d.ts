/** Translation functions bound to the words and the language of one `init`. */
export interface Translator {
    /** Get translation as one string */
    translate(key: string, ...args: (string | number | boolean | null)[]): string;
    /** Alias shortcut for translate function */
    t(key: string, ...args: (string | number | boolean | null)[]): string;
    /** Get translation as ioBroker.Translated object */
    getTranslatedObject(key: string, ...args: (string | number | boolean | null)[]): ioBroker.Translated;
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
export declare function init(rootDir: string, languageOrAdapter: ioBroker.Adapter | ioBroker.Languages): Promise<Translator>;
/**
 * Get translation as one string
 *
 * @param key Word to translate
 * @param args Optional parameters to replace %s
 */
export declare function translate(key: string, ...args: (string | number | boolean | null)[]): string;
/** Alias shortcut for translate function */
export declare const t: typeof translate;
/**
 * Get translation as ioBroker.Translated object
 *
 * @param key Word to translate
 * @param args Optional parameters to replace %s
 */
export declare function getTranslatedObject(key: string, ...args: (string | number | boolean | null)[]): ioBroker.Translated;
declare const _default: {
    init: typeof init;
    translate: typeof translate;
    getTranslatedObject: typeof getTranslatedObject;
    t: typeof translate;
};
export default _default;
