"use strict";
/* eslint-disable @typescript-eslint/no-var-requires */
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Adapter = exports.adapter = exports.getConfig = exports.controllerDir = void 0;
const fs = require("fs");
const path = require("path");
function tryResolvePackage(possiblePaths, lookupPaths) {
    for (const pkg of possiblePaths) {
        try {
            // package.json is guaranteed to be in the module root folder
            // so once that is resolved, take the dirname and we're done
            const possiblePath = require.resolve(`${pkg}/package.json`, (lookupPaths === null || lookupPaths === void 0 ? void 0 : lookupPaths.length) ? { paths: lookupPaths } : undefined);
            if (fs.existsSync(possiblePath)) {
                return path.dirname(possiblePath);
            }
        }
        catch (_a) {
            /* not found */
        }
    }
}
function scanForPackage(possiblePaths, startDir = __dirname) {
    // We start in the node_modules subfolder of adapter-core, which is the deepest we should be able to expect the controller
    let curDir = path.join(startDir, "../node_modules");
    while (true) {
        for (const pkg of possiblePaths) {
            const possiblePath = path.join(curDir, pkg, "package.json");
            try {
                // If package.json exists in the directory and its name field matches, we've found js-controller
                if (fs.existsSync(possiblePath) &&
                    JSON.parse(fs.readFileSync(possiblePath, "utf8")).name ===
                        pkg.toLowerCase()) {
                    return path.dirname(possiblePath);
                }
            }
            catch (_a) {
                // don't care
            }
        }
        // Nothing found here, go up one level
        const parentDir = path.dirname(curDir);
        if (parentDir === curDir) {
            // we've reached the root without finding js-controller
            break;
        }
        curDir = parentDir;
    }
}
/**
 * Resolves the root directory of JS-Controller and returns it or exits the process
 * @param isInstall Whether the adapter is run in "install" mode or if it should execute normally
 */
function getControllerDir(isInstall) {
    // Find the js-controller location
    const possibilities = ["iobroker.js-controller", "ioBroker.js-controller"];
    // First try to let Node.js resolve the package by itself
    let controllerDir = tryResolvePackage(possibilities);
    // Apparently, checking vs null/undefined may miss the odd case of controllerPath being ""
    // Thus we check for falsyness, which includes failing on an empty path
    if (controllerDir)
        return controllerDir;
    // As a fallback solution, we walk up the directory tree until we reach the root or find js-controller
    controllerDir = scanForPackage(possibilities);
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
    let adapterPath = tryResolvePackage(["@iobroker/js-controller-adapter"]);
    if (adapterPath) {
        try {
            const { Adapter } = require(adapterPath);
            if (Adapter)
                return console.log("found adapter, attempt 1"), Adapter;
        }
        catch (_a) {
            // did not work, continue
        }
    }
    // Attempt 2: Resolve @iobroker/js-controller-adapter in JS-Controller dir - JS-Controller 4.1+
    adapterPath = tryResolvePackage(["@iobroker/js-controller-adapter"], [path.join(exports.controllerDir, "node_modules")]);
    if (adapterPath) {
        try {
            const { Adapter } = require(adapterPath);
            if (Adapter)
                return console.log("found adapter, attempt 2"), Adapter;
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
            return console.log("found adapter, attempt 3"), Adapter;
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
            return console.log("found adapter, attempt 4"), Adapter;
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
