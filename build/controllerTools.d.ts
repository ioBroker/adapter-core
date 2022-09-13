export declare let controllerCommonModulesInternal: any;
/** The collection of utility functions in JS-Controller, formerly `lib/tools.js` */
export declare const controllerToolsInternal: any;
/**
 * Resolve a module that is either exported by @iobroker/js-controller-common (new controllers) or located in in the controller's `lib` directory (old controllers).
 * @param name - The filename of the module to resolve
 * @param exportName - The name under which the module may be exported. Defaults to `name`.
 */
export declare function resolveNamedModule(name: string, exportName?: string): any;
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
