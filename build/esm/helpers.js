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
exports.scanForPackage = exports.tryResolvePackage = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Tries to resolve a package using Node.js resolution.
 * Directory names differing from the package name and alternate lookup paths can be passed.
 */
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
exports.tryResolvePackage = tryResolvePackage;
/**
 * Scans for a package by walking up the directory tree and inspecting package.json
 * Directory names differing from the package name and an alternate start dir can be passed.
 */
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
exports.scanForPackage = scanForPackage;
