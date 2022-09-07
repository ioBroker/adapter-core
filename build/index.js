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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXIT_CODES = exports.getAbsoluteInstanceDataDir = exports.getAbsoluteDefaultDataDir = void 0;
const path = require("path");
const helpers_1 = require("./helpers");
const utils = require("./utils");
/* eslint-disable @typescript-eslint/no-var-requires */
// Export all methods that used to be in utils.js
__exportStar(require("./utils"), exports);
// Export some additional utility methods
function resolveControllerTools() {
    // Attempt 1: Resolve @iobroker/js-controller-common from here - JS-Controller 4.1+
    let importPath = (0, helpers_1.tryResolvePackage)(["@iobroker/js-controller-common"]);
    if (importPath) {
        try {
            const { tools } = require(importPath);
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
            const { tools } = require(importPath);
            if (tools)
                return tools;
        }
        catch (_b) {
            // did not work, continue
        }
    }
    // Attempt 3: Legacy resolve - until JS-Controller 4.0
    importPath = path.join(utils.controllerDir, "lib/tools");
    try {
        // This was a default export prior to the TS migration
        const tools = require(importPath);
        if (tools)
            return tools;
    }
    catch (_c) {
        // did not work, continue
    }
    throw new Error("Cannot resolve tools module");
    return process.exit(10);
}
const controllerTools = resolveControllerTools();
/**
 * Returns the absolute path of the data directory for the current host. On linux, this is usually `/opt/iobroker/iobroker-data`.
 */
function getAbsoluteDefaultDataDir() {
    return path.join(utils.controllerDir, controllerTools.getDefaultDataDir());
}
exports.getAbsoluteDefaultDataDir = getAbsoluteDefaultDataDir;
/**
 * Returns the absolute path of the data directory for the current adapter instance.
 * On linux, this is usually `/opt/iobroker/iobroker-data/<adapterName>.<instanceNr>`
 */
function getAbsoluteInstanceDataDir(adapterObject) {
    return path.join(getAbsoluteDefaultDataDir(), adapterObject.namespace);
}
exports.getAbsoluteInstanceDataDir = getAbsoluteInstanceDataDir;
// TODO: Expose some system utilities here, e.g. for installing npm modules (GH#1)
function resolveExitCodes() {
    // Attempt 1: Resolve @iobroker/js-controller-common from here - JS-Controller 4.1+
    let importPath = (0, helpers_1.tryResolvePackage)(["@iobroker/js-controller-common"]);
    if (importPath) {
        try {
            const { EXIT_CODES } = require(importPath);
            if (EXIT_CODES)
                return EXIT_CODES;
        }
        catch (_a) {
            // did not work, continue
        }
    }
    // Attempt 2: Resolve @iobroker/js-controller-common in JS-Controller dir - JS-Controller 4.1+
    importPath = (0, helpers_1.tryResolvePackage)(["@iobroker/js-controller-common"], [path.join(utils.controllerDir, "node_modules")]);
    if (importPath) {
        try {
            const { EXIT_CODES } = require(importPath);
            if (EXIT_CODES)
                return EXIT_CODES;
        }
        catch (_b) {
            // did not work, continue
        }
    }
    // Attempt 3: Legacy resolve - until JS-Controller 4.0
    importPath = path.join(utils.controllerDir, "lib/exitCodes");
    try {
        // This was a default export prior to the TS migration
        const EXIT_CODES = require(importPath);
        if (EXIT_CODES)
            return EXIT_CODES;
    }
    catch (_c) {
        // did not work, continue
    }
    throw new Error("Cannot resolve EXIT_CODES");
    return process.exit(10);
}
exports.EXIT_CODES = Object.freeze(Object.assign({}, resolveExitCodes()));
