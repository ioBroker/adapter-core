import * as path from "node:path";
import { tryResolvePackage } from "./helpers.js";
import * as utils from "./utils.js";
import { createRequire } from "node:module";
// eslint-disable-next-line unicorn/prefer-module
var require = createRequire(import.meta.url || "file://" + __filename);
export var controllerCommonModulesInternal;
function resolveControllerTools() {
    // Attempt 1: Resolve @iobroker/js-controller-common from here - JS-Controller 4.1+
    var importPath = tryResolvePackage(["@iobroker/js-controller-common"]);
    if (importPath) {
        try {
            controllerCommonModulesInternal = require(importPath);
            var tools = controllerCommonModulesInternal.tools;
            if (tools)
                return tools;
        }
        catch (_a) {
            // did not work, continue
        }
    }
    // Attempt 2: Resolve @iobroker/js-controller-common in JS-Controller dir - JS-Controller 4.1+
    importPath = tryResolvePackage(["@iobroker/js-controller-common"], [path.join(utils.controllerDir, "node_modules")]);
    if (importPath) {
        try {
            controllerCommonModulesInternal = require(importPath);
            var tools = controllerCommonModulesInternal.tools;
            if (tools)
                return tools;
        }
        catch (_b) {
            // did not work, continue
        }
    }
    // Attempt 3: Legacy resolve - until JS-Controller 4.0
    importPath = path.join(utils.controllerDir, "lib");
    try {
        // This was a default export prior to the TS migration
        var tools = require(path.join(importPath, "tools"));
        if (tools)
            return tools;
    }
    catch (_c) {
        // did not work, continue
    }
    throw new Error("Cannot resolve tools module");
    //return process.exit(10);
}
/** The collection of utility functions in JS-Controller, formerly `lib/tools.js` */
export var controllerToolsInternal = resolveControllerTools();
// Export a subset of the utilties in controllerTools
/**
 * Resolve a module that is either exported by @iobroker/js-controller-common (new controllers) or located in the controller's `lib` directory (old controllers).
 * @param name - The filename of the module to resolve
 * @param exportName - The name under which the module may be exported. Defaults to `name`.
 */
export function resolveNamedModule(name, exportName) {
    if (exportName === void 0) { exportName = name; }
    // The requested module might be moved to @iobroker/js-controller-common and exported from there
    if (controllerCommonModulesInternal === null || controllerCommonModulesInternal === void 0 ? void 0 : controllerCommonModulesInternal[exportName])
        return controllerCommonModulesInternal[exportName];
    // Otherwise it was not moved yet, or we're dealing with JS-Controller <= 4.0
    var importPaths = [
        // Attempt 1: JS-Controller 6+
        path.join(utils.controllerDir, "build/cjs/lib", name),
        // Attempt 2: JS-Controller 4.1+
        path.join(utils.controllerDir, "build/lib", name),
        // Attempt 3: JS-Controller <= 4.0
        path.join(utils.controllerDir, "lib", name),
    ];
    for (var _i = 0, importPaths_1 = importPaths; _i < importPaths_1.length; _i++) {
        var importPath = importPaths_1[_i];
        try {
            // This was a default export prior to the TS migration
            var module_1 = require(importPath);
            if (module_1)
                return module_1;
        }
        catch (_a) {
            // did not work, continue
        }
    }
    throw new Error("Cannot resolve JS-Controller module ".concat(name, ".js"));
    //return process.exit(10);
}
// TODO: Import types from @iobroker/js-controller-common and iobroker.js-controller
/**
 * Converts a pattern to match object IDs into a RegEx string that can be used in `new RegExp(...)`
 * @param pattern The pattern to convert
 * @returns The RegEx string
 */
function pattern2RegEx(pattern) {
    return controllerToolsInternal.pattern2RegEx(pattern);
}
/**
 * Finds the adapter directory of a given adapter
 *
 * @param adapter name of the adapter, e.g. hm-rpc
 * @returns path to adapter directory or null if no directory found
 */
function getAdapterDir(adapter) {
    return controllerToolsInternal.getAdapterDir(adapter);
}
/**
 * Get list of all installed adapters and controller version on this host
 * @param hostJsControllerVersion Version of the running js-controller, will be included in the returned information if provided
 * @returns object containing information about installed host
 */
function getInstalledInfo(hostJsControllerVersion) {
    return controllerToolsInternal.getInstalledInfo(hostJsControllerVersion);
}
/**
 * Checks if we are running inside a docker container
 */
function isDocker() {
    return controllerToolsInternal.isDocker();
}
/**
 * Checks if given ip address is matching ipv4 or ipv6 localhost
 * @param ip ipv4 or ipv6 address
 */
function isLocalAddress(ip) {
    return controllerToolsInternal.isLocalAddress(ip);
}
/**
 * Checks if given ip address is matching ipv4 or ipv6 "listen all" address
 * @param ip ipv4 or ipv6 address
 */
function isListenAllAddress(ip) {
    return controllerToolsInternal.isListenAllAddress(ip);
}
/**
 * Retrieve the localhost address according to the configured DNS resolution strategy
 */
function getLocalAddress() {
    return controllerToolsInternal.getLocalAddress();
}
/**
 * Get the ip to listen to all addresses according to configured DNS resolution strategy
 */
function getListenAllAddress() {
    return controllerToolsInternal.getListenAllAddress();
}
export var commonTools = {
    pattern2RegEx: pattern2RegEx,
    getAdapterDir: getAdapterDir,
    getInstalledInfo: getInstalledInfo,
    isDocker: isDocker,
    getLocalAddress: getLocalAddress,
    getListenAllAddress: getListenAllAddress,
    isLocalAddress: isLocalAddress,
    isListenAllAddress: isListenAllAddress,
    // TODO: Add more methods from lib/tools.js as needed
    password: resolveNamedModule("password"),
    session: resolveNamedModule("session"),
    zipFiles: resolveNamedModule("zipFiles"),
    // TODO: expose more (internal) controller modules as needed
};
