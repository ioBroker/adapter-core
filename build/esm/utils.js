"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Adapter = exports.adapter = exports.controllerDir = void 0;
exports.getConfig = getConfig;
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const helpers_js_1 = require("./helpers.js");
const _require_1 = require("#require");
/**
 * Resolves the root directory of JS-Controller and returns it or exits the process
 *
 * @param isInstall Whether the adapter is run in "install" mode or if it should execute normally
 */
function getControllerDir(isInstall) {
    // Find the js-controller location
    const possibilities = ['iobroker.js-controller', 'ioBroker.js-controller'];
    // First, try to let Node.js resolve the package by itself
    let controllerDir = (0, helpers_js_1.tryResolvePackage)(possibilities);
    // Apparently, checking vs. null/undefined may miss the odd case of controllerPath being ""
    // Thus we check for falseness, which includes failing on an empty path
    if (controllerDir) {
        return controllerDir;
    }
    // As a fallback solution, we walk up the directory tree until we reach the root or find js-controller
    controllerDir = (0, helpers_js_1.scanForPackage)(possibilities);
    if (controllerDir) {
        return controllerDir;
    }
    if (!isInstall) {
        console.log('Cannot find js-controller');
        return process.exit(10);
    }
    return process.exit();
}
/** The root directory of JS-Controller */
exports.controllerDir = getControllerDir(!!process?.argv?.includes('--install'));
function resolveAdapterConstructor() {
    // Attempt 1: Resolve @iobroker/js-controller-adapter from here - JS-Controller 4.1+
    let adapterPath = (0, helpers_js_1.tryResolvePackage)(['@iobroker/js-controller-adapter']);
    if (adapterPath) {
        try {
            const { Adapter } = (0, _require_1.require)(adapterPath);
            if (Adapter) {
                return Adapter;
            }
        }
        catch {
            // did not work, continue
        }
    }
    // Attempt 2: Resolve @iobroker/js-controller-adapter in JS-Controller dir - JS-Controller 4.1+
    adapterPath = (0, helpers_js_1.tryResolvePackage)(['@iobroker/js-controller-adapter'], [(0, node_path_1.join)(exports.controllerDir, 'node_modules')]);
    if (adapterPath) {
        try {
            const { Adapter } = (0, _require_1.require)(adapterPath);
            if (Adapter) {
                return Adapter;
            }
        }
        catch {
            // did not work, continue
        }
    }
    // Attempt 3: JS-Controller 6+ with adapter stub
    adapterPath = (0, node_path_1.join)(exports.controllerDir, 'build/cjs/lib/adapter.js');
    try {
        // This was a default export prior to the TS migration
        const Adapter = (0, _require_1.require)(adapterPath);
        if (Adapter) {
            return Adapter;
        }
    }
    catch {
        // did not work, continue
    }
    // Attempt 4: JS-Controller 4.1+ with adapter stub
    adapterPath = (0, node_path_1.join)(exports.controllerDir, 'build/lib/adapter.js');
    try {
        // This was a default export prior to the TS migration
        const Adapter = (0, _require_1.require)(adapterPath);
        if (Adapter) {
            return Adapter;
        }
    }
    catch {
        // did not work, continue
    }
    // Attempt 5: Legacy resolve - until JS-Controller 4.0
    adapterPath = (0, node_path_1.join)(exports.controllerDir, 'lib/adapter.js');
    try {
        // This was a default export prior to the TS migration
        const Adapter = (0, _require_1.require)(adapterPath);
        if (Adapter) {
            return Adapter;
        }
    }
    catch {
        // did not work, continue
    }
    throw new Error('Cannot resolve adapter class');
}
/** Reads the configuration file of JS-Controller */
function getConfig() {
    return JSON.parse((0, node_fs_1.readFileSync)((0, node_path_1.join)(exports.controllerDir, 'conf/iobroker.json'), 'utf8'));
}
/** Creates a new adapter instance */
exports.adapter = resolveAdapterConstructor();
/** Creates a new adapter instance */
exports.Adapter = exports.adapter;
