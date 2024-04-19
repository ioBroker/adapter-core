"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonTools = exports.resolveNamedModule = exports.controllerToolsInternal = exports.controllerCommonModulesInternal = void 0;
const path = __importStar(require("path"));
const helpers_1 = require("./helpers");
const utils = __importStar(require("./utils"));
function resolveControllerTools() {
    // Attempt 1: Resolve @iobroker/js-controller-common from here - JS-Controller 4.1+
    let importPath = (0, helpers_1.tryResolvePackage)(["@iobroker/js-controller-common"]);
    if (importPath) {
        try {
            exports.controllerCommonModulesInternal = require(importPath);
            const { tools } = exports.controllerCommonModulesInternal;
            if (tools)
                return tools;
        }
        catch (_a) {
            // did not work, continue
        }
    }
    // Attempt 2: Resolve @iobroker/js-controller-common in JS-Controller dir - JS-Controller 4.1+
    importPath = (0, helpers_1.tryResolvePackage)(["@iobroker/js-controller-common"], [path.join(utils.controllerDir, "node_modules")]);
    if (importPath) {
        try {
            exports.controllerCommonModulesInternal = require(importPath);
            const { tools } = exports.controllerCommonModulesInternal;
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
        const tools = require(path.join(importPath, "tools"));
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
exports.controllerToolsInternal = resolveControllerTools();
// Export a subset of the utilties in controllerTools
/**
 * Resolve a module that is either exported by @iobroker/js-controller-common (new controllers) or located in the controller's `lib` directory (old controllers).
 * @param name - The filename of the module to resolve
 * @param exportName - The name under which the module may be exported. Defaults to `name`.
 */
function resolveNamedModule(name, exportName = name) {
    // The requested module might be moved to @iobroker/js-controller-common and exported from there
    if (exports.controllerCommonModulesInternal === null || exports.controllerCommonModulesInternal === void 0 ? void 0 : exports.controllerCommonModulesInternal[exportName])
        return exports.controllerCommonModulesInternal[exportName];
    // Otherwise it was not moved yet, or we're dealing with JS-Controller <= 4.0
    const importPaths = [
        // Attempt 1: JS-Controller 6+
        path.join(utils.controllerDir, "build/cjs/lib", name),
        // Attempt 2: JS-Controller 4.1+
        path.join(utils.controllerDir, "build/lib", name),
        // Attempt 3: JS-Controller <= 4.0
        path.join(utils.controllerDir, "lib", name),
    ];
    for (const importPath of importPaths) {
        try {
            // This was a default export prior to the TS migration
            const module = require(importPath);
            if (module)
                return module;
        }
        catch (_a) {
            // did not work, continue
        }
    }
    throw new Error(`Cannot resolve JS-Controller module ${name}.js`);
    //return process.exit(10);
}
exports.resolveNamedModule = resolveNamedModule;
// TODO: Import types from @iobroker/js-controller-common and iobroker.js-controller
/**
 * Converts a pattern to match object IDs into a RegEx string that can be used in `new RegExp(...)`
 * @param pattern The pattern to convert
 * @returns The RegEx string
 */
function pattern2RegEx(pattern) {
    return exports.controllerToolsInternal.pattern2RegEx(pattern);
}
/**
 * Finds the adapter directory of a given adapter
 *
 * @param adapter name of the adapter, e.g. hm-rpc
 * @returns path to adapter directory or null if no directory found
 */
function getAdapterDir(adapter) {
    return exports.controllerToolsInternal.getAdapterDir(adapter);
}
/**
 * Get list of all installed adapters and controller version on this host
 * @param hostJsControllerVersion Version of the running js-controller, will be included in the returned information if provided
 * @returns object containing information about installed host
 */
function getInstalledInfo(hostJsControllerVersion) {
    return exports.controllerToolsInternal.getInstalledInfo(hostJsControllerVersion);
}
/**
 * Checks if we are running inside a docker container
 */
function isDocker() {
    return exports.controllerToolsInternal.isDocker();
}
/**
 * Checks if given ip address is matching ipv4 or ipv6 localhost
 * @param ip ipv4 or ipv6 address
 */
function isLocalAddress(ip) {
    return exports.controllerToolsInternal.isLocalAddress(ip);
}
/**
 * Checks if given ip address is matching ipv4 or ipv6 "listen all" address
 * @param ip ipv4 or ipv6 address
 */
function isListenAllAddress(ip) {
    return exports.controllerToolsInternal.isListenAllAddress(ip);
}
/**
 * Retrieve the localhost address according to the configured DNS resolution strategy
 */
function getLocalAddress() {
    return exports.controllerToolsInternal.getLocalAddress();
}
/**
 * Get the ip to listen to all addresses according to configured DNS resolution strategy
 */
function getListenAllAddress() {
    return exports.controllerToolsInternal.getListenAllAddress();
}
exports.commonTools = {
    pattern2RegEx,
    getAdapterDir,
    getInstalledInfo,
    isDocker,
    getLocalAddress,
    getListenAllAddress,
    isLocalAddress,
    isListenAllAddress,
    // TODO: Add more methods from lib/tools.js as needed
    password: resolveNamedModule("password"),
    session: resolveNamedModule("session"),
    zipFiles: resolveNamedModule("zipFiles"),
    // TODO: expose more (internal) controller modules as needed
};
