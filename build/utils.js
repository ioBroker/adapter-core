"use strict";
/* eslint-disable @typescript-eslint/no-var-requires */
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Adapter = exports.adapter = exports.getConfig = exports.controllerDir = void 0;
const fs = require("fs");
const path = require("path");
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
    const adapterPaths = [
        // Attempt 1: Resolve @iobroker/js-controller-adapter from here - JS-Controller 4.1+
        (0, helpers_1.tryResolvePackage)(["@iobroker/js-controller-adapter"]),
        // Attempt 2: Resolve @iobroker/js-controller-adapter in JS-Controller dir - JS-Controller 4.1+
        (0, helpers_1.tryResolvePackage)(["@iobroker/js-controller-adapter"], [path.join(exports.controllerDir, "node_modules")]),
        // Attempt 3: JS-Controller 4.1+ with adapter stub
        path.join(exports.controllerDir, "build/lib/adapter.js"),
        // Attempt 4: JS-Controller 5.1+ with adapter stub
        path.join(exports.controllerDir, "build/cjs/lib/adapter.js"),
        // Attempt 5: Legacy resolve - until JS-Controller 4.0
        path.join(exports.controllerDir, "lib/adapter.js"),
    ];
    for (const adapterPath of adapterPaths) {
        if (!adapterPath)
            continue;
        try {
            const Adapter = require(adapterPath);
            if (Adapter)
                return Adapter;
        }
        catch (_a) {
            // did not work, continue
        }
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
