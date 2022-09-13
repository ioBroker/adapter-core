/** The collection of utility functions in JS-Controller, formerly `lib/tools.js` */
export declare const controllerToolsInternal: any;
/**
 * Converts a pattern to match object IDs into a RegEx string that can be used in `new RegExp(...)`
 * @param pattern The pattern to convert
 */
declare function pattern2RegEx(pattern: string): string;
export declare const commonTools: {
    pattern2RegEx: typeof pattern2RegEx;
    password: any;
    letsEncrypt: any;
    session: any;
    zipFiles: any;
};
export {};
