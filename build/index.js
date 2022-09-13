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
exports.EXIT_CODES = exports.getAbsoluteInstanceDataDir = exports.getAbsoluteDefaultDataDir = exports.commonTools = void 0;
const path = require("path");
const controllerTools_1 = require("./controllerTools");
const utils = require("./utils");
/* eslint-disable @typescript-eslint/no-var-requires */
// Export utility methods to be used in adapters
var controllerTools_2 = require("./controllerTools");
Object.defineProperty(exports, "commonTools", { enumerable: true, get: function () { return controllerTools_2.commonTools; } });
__exportStar(require("./utils"), exports);
/**
 * Returns the absolute path of the data directory for the current host. On linux, this is usually `/opt/iobroker/iobroker-data`.
 */
function getAbsoluteDefaultDataDir() {
    return path.join(utils.controllerDir, controllerTools_1.controllerToolsInternal.getDefaultDataDir());
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
    if ("EXIT_CODES" in controllerTools_1.controllerToolsInternal)
        return controllerTools_1.controllerToolsInternal.EXIT_CODES;
    // We're dealing with JS-Controller <= 4.0
    const importPath = path.join(utils.controllerDir, "lib/exitCodes");
    try {
        // This was a default export prior to the TS migration
        const EXIT_CODES = require(importPath);
        if (EXIT_CODES)
            return EXIT_CODES;
    }
    catch (_a) {
        // did not work, continue
    }
    throw new Error("Cannot resolve EXIT_CODES");
    return process.exit(10);
}
exports.EXIT_CODES = Object.freeze(Object.assign({}, resolveExitCodes()));
