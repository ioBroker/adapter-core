var _a;
import * as fs from "node:fs";
import * as path from "node:path";
import { createRequire } from "node:module";
import { scanForPackage, tryResolvePackage } from "./helpers";
// eslint-disable-next-line unicorn/prefer-module
var require = createRequire(import.meta.url || "file:// " + __filename);
/**
 * Resolves the root directory of JS-Controller and returns it or exits the process
 * @param isInstall Whether the adapter is run in "install" mode or if it should execute normally
 */
function getControllerDir(isInstall) {
    // Find the js-controller location
    var possibilities = ["iobroker.js-controller", "ioBroker.js-controller"];
    // First try to let Node.js resolve the package by itself
    var controllerDir = tryResolvePackage(possibilities);
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
export var controllerDir = getControllerDir(!!((_a = process === null || process === void 0 ? void 0 : process.argv) === null || _a === void 0 ? void 0 : _a.includes("--install")));
function resolveAdapterConstructor() {
    // Attempt 1: Resolve @iobroker/js-controller-adapter from here - JS-Controller 4.1+
    var adapterPath = tryResolvePackage(["@iobroker/js-controller-adapter"]);
    if (adapterPath) {
        try {
            var Adapter_1 = require(adapterPath).Adapter;
            if (Adapter_1)
                return Adapter_1;
        }
        catch (_a) {
            // did not work, continue
        }
    }
    // Attempt 2: Resolve @iobroker/js-controller-adapter in JS-Controller dir - JS-Controller 4.1+
    adapterPath = tryResolvePackage(["@iobroker/js-controller-adapter"], [path.join(controllerDir, "node_modules")]);
    if (adapterPath) {
        try {
            var Adapter_2 = require(adapterPath).Adapter;
            if (Adapter_2)
                return Adapter_2;
        }
        catch (_b) {
            // did not work, continue
        }
    }
    // Attempt 3: JS-Controller 6+ with adapter stub
    adapterPath = path.join(controllerDir, "build/cjs/lib/adapter.js");
    try {
        // This was a default export prior to the TS migration
        var Adapter_3 = require(adapterPath);
        if (Adapter_3)
            return Adapter_3;
    }
    catch (_c) {
        // did not work, continue
    }
    // Attempt 4: JS-Controller 4.1+ with adapter stub
    adapterPath = path.join(controllerDir, "build/lib/adapter.js");
    try {
        // This was a default export prior to the TS migration
        var Adapter_4 = require(adapterPath);
        if (Adapter_4)
            return Adapter_4;
    }
    catch (_d) {
        // did not work, continue
    }
    // Attempt 5: Legacy resolve - until JS-Controller 4.0
    adapterPath = path.join(controllerDir, "lib/adapter.js");
    try {
        // This was a default export prior to the TS migration
        var Adapter_5 = require(adapterPath);
        if (Adapter_5)
            return Adapter_5;
    }
    catch (_e) {
        // did not work, continue
    }
    throw new Error("Cannot resolve adapter class");
    return process.exit(10);
}
/** Reads the configuration file of JS-Controller */
export function getConfig() {
    return JSON.parse(fs.readFileSync(path.join(controllerDir, "conf/iobroker.json"), "utf8"));
}
/** Creates a new adapter instance */
export var adapter = resolveAdapterConstructor();
/** Creates a new adapter instance */
export var Adapter = adapter;
