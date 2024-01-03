"use strict";
/* eslint-disable @typescript-eslint/no-var-requires */
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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Adapter = exports.adapter = exports.getConfig = exports.controllerDir = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const helpers_1 = require("./helpers");
/**
 * Resolves the root directory of JS-Controller and returns it or exits the process
 * @param isInstall Whether the adapter is run in "install" mode or if it should execute normally
 */
function getControllerDir(isInstall) {
    // Find the js-controller location
    const possibilities = ["iobroker.js-controller", "ioBroker.js-controller"];
    // First try to let Node.js resolve the package by itself
    let controllerDir = (0, helpers_1.tryResolvePackage)(possibilities);
    // Apparently, checking vs null/undefined may miss the odd case of controllerPath being ""
    // Thus we check for falsyness, which includes failing on an empty path
    if (controllerDir)
        return controllerDir;
    // As a fallback solution, we walk up the directory tree until we reach the root or find js-controller
    controllerDir = (0, helpers_1.scanForPackage)(possibilities);
    if (controllerDir)
        return controllerDir;
    if (!isInstall) {
        console.log("Cannot find js-controller");
        return process.exit(10);
    }
    else {
        return process.exit();
    }
}
/** The root directory of JS-Controller */
exports.controllerDir = getControllerDir(!!((_a = process === null || process === void 0 ? void 0 : process.argv) === null || _a === void 0 ? void 0 : _a.includes("--install")));
function resolveAdapterConstructor() {
    // Attempt 1: Resolve @iobroker/js-controller-adapter from here - JS-Controller 4.1+
    let adapterPath = (0, helpers_1.tryResolvePackage)(["@iobroker/js-controller-adapter"]);
    if (adapterPath) {
        try {
            const { Adapter } = require(adapterPath);
            if (Adapter)
                return Adapter;
        }
        catch (_a) {
            // did not work, continue
        }
    }
    // Attempt 2: Resolve @iobroker/js-controller-adapter in JS-Controller dir - JS-Controller 4.1+
    adapterPath = (0, helpers_1.tryResolvePackage)(["@iobroker/js-controller-adapter"], [path.join(exports.controllerDir, "node_modules")]);
    if (adapterPath) {
        try {
            const { Adapter } = require(adapterPath);
            if (Adapter)
                return Adapter;
        }
        catch (_b) {
            // did not work, continue
        }
    }
    // Attempt 3: Legacy resolve - until JS-Controller 4.0
    adapterPath = path.join(exports.controllerDir, "lib/adapter.js");
    try {
        // This was a default export prior to the TS migration
        const Adapter = require(adapterPath);
        if (Adapter)
            return Adapter;
    }
    catch (_c) {
        // did not work, continue
    }
    // Attempt 4: JS-Controller 4.1+ with adapter stub
    adapterPath = path.join(exports.controllerDir, "build/lib/adapter.js");
    try {
        // This was a default export prior to the TS migration
        const Adapter = require(adapterPath);
        if (Adapter)
            return Adapter;
    }
    catch (_d) {
        // did not work, continue
    }
    throw new Error("Cannot resolve adapter class");
    return process.exit(10);
}
/** Reads the configuration file of JS-Controller */
function getConfig() {
    return JSON.parse(fs.readFileSync(path.join(exports.controllerDir, "conf/iobroker.json"), "utf8"));
}
exports.getConfig = getConfig;
/** Creates a new adapter instance */
exports.adapter = resolveAdapterConstructor();
/** Creates a new adapter instance */
exports.Adapter = exports.adapter;
