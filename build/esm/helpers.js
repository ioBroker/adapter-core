"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryResolvePackage = tryResolvePackage;
exports.scanForPackage = scanForPackage;
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const _require_1 = require("#require");
// The directory this file is located in after the build (build/esm or build/cjs).
// The #require helper lives in the require/ subfolder of that directory.
const thisDir = (0, node_path_1.join)(_require_1.dirName, '..');
/**
 * Tries to resolve a package using Node.js resolution.
 * Directory names differing from the package name and alternate lookup paths can be passed.
 *
 * @param possiblePaths all possible paths the package can be resolved from
 * @param lookupPaths lookup paths passed to `require.resolve`
 */
function tryResolvePackage(possiblePaths, lookupPaths) {
    for (const pkg of possiblePaths) {
        try {
            // package.json is guaranteed to be in the module root folder
            // so once that is resolved, take the dirname and we're done
            const possiblePath = _require_1.require.resolve(`${pkg}/package.json`, lookupPaths?.length ? { paths: lookupPaths } : undefined);
            if ((0, node_fs_1.existsSync)(possiblePath)) {
                return (0, node_path_1.dirname)(possiblePath);
            }
        }
        catch {
            /* not found */
        }
    }
}
/**
 * Scans for a package by walking up the directory tree and inspecting package.json
 * Directory names differing from the package name and an alternate start dir can be passed.
 *
 * @param possiblePaths All possible paths to check
 * @param startDir Optional start directory where we scan for the package
 */
function scanForPackage(possiblePaths, startDir = thisDir) {
    // We start in the node_modules subfolder of adapter-core,
    // which is the deepest we should be able to expect the controller
    let curDir = (0, node_path_1.join)(startDir, '../node_modules');
    while (true) {
        for (const pkg of possiblePaths) {
            const possiblePath = (0, node_path_1.join)(curDir, pkg, 'package.json');
            try {
                // If package.json exists in the directory and its name field matches, we've found js-controller
                if ((0, node_fs_1.existsSync)(possiblePath) &&
                    JSON.parse((0, node_fs_1.readFileSync)(possiblePath, 'utf8')).name === pkg.toLowerCase()) {
                    return (0, node_path_1.dirname)(possiblePath);
                }
            }
            catch {
                // don't care
            }
        }
        // Nothing found here, go up one level
        const parentDir = (0, node_path_1.dirname)(curDir);
        if (parentDir === curDir) {
            // we've reached the root without finding js-controller
            break;
        }
        curDir = parentDir;
    }
}
