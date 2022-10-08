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
 * @returns The RegEx string
 */
declare function pattern2RegEx(pattern: string): string;
/**
 * Finds the adapter directory of a given adapter
 *
 * @param adapter name of the adapter, e.g. hm-rpc
 * @returns path to adapter directory or null if no directory found
 */
declare function getAdapterDir(adapter: string): string | null;
interface Multilingual {
    en: string;
    de?: string;
    ru?: string;
    pt?: string;
    nl?: string;
    fr?: string;
    it?: string;
    es?: string;
    pl?: string;
    uk?: string;
    "zh-cn"?: string;
}
export interface GetInstalledInfoReponse {
    controller?: boolean;
    version?: string;
    icon?: string;
    title?: string;
    titleLang?: Multilingual;
    desc?: Multilingual;
    platform?: string;
    keywords?: string[];
    readme?: string;
    runningVersion?: string;
    license?: string;
    licenseUrl?: string;
}
/**
 * Get list of all installed adapters and controller version on this host
 * @param hostJsControllerVersion Version of the running js-controller, will be included in the returned information if provided
 * @returns object containing information about installed host
 */
declare function getInstalledInfo(hostJsControllerVersion?: string): GetInstalledInfoReponse;
/**
 * Checks if we are running inside a docker container
 */
declare function isDocker(): boolean;
export declare const commonTools: {
    pattern2RegEx: typeof pattern2RegEx;
    getAdapterDir: typeof getAdapterDir;
    getInstalledInfo: typeof getInstalledInfo;
    isDocker: typeof isDocker;
    password: any;
    letsEncrypt: any;
    session: any;
    zipFiles: any;
};
export {};
