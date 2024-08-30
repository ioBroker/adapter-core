export declare function init(
/** The root directory of the adapter */
rootDir: string, 
/** The adapter instance or the language to use */
langOrAdmin: ioBroker.Adapter | ioBroker.Languages): Promise<void>;
/**
 * Get translation as one string
 */
export declare function t(
/** Word to translate */
key: string, 
/** Optional parameters to replace %s */
...args: (string | number | boolean | null)[]): string;
/**
 * Get translation as ioBroker.Translated object
 */
export declare function tt(
/** Word to translate */
key: string, 
/** Optional parameters to replace %s */
...args: (string | number | boolean | null)[]): ioBroker.StringOrTranslated;
