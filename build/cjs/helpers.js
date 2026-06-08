"use strict";
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryResolvePackage = tryResolvePackage;
exports.scanForPackage = scanForPackage;
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const _require_1 = require("#require");
const thisDir = (0, node_path_1.join)(_require_1.dirName, "..");
function tryResolvePackage(possiblePaths, lookupPaths) {
  for (const pkg of possiblePaths) {
    try {
      const possiblePath = _require_1.require.resolve(`${pkg}/package.json`, lookupPaths?.length ? { paths: lookupPaths } : void 0);
      if ((0, node_fs_1.existsSync)(possiblePath)) {
        return (0, node_path_1.dirname)(possiblePath);
      }
    } catch {
    }
  }
}
__name(tryResolvePackage, "tryResolvePackage");
function scanForPackage(possiblePaths, startDir = thisDir) {
  let curDir = (0, node_path_1.join)(startDir, "../node_modules");
  while (true) {
    for (const pkg of possiblePaths) {
      const possiblePath = (0, node_path_1.join)(curDir, pkg, "package.json");
      try {
        if ((0, node_fs_1.existsSync)(possiblePath) && JSON.parse((0, node_fs_1.readFileSync)(possiblePath, "utf8")).name === pkg.toLowerCase()) {
          return (0, node_path_1.dirname)(possiblePath);
        }
      } catch {
      }
    }
    const parentDir = (0, node_path_1.dirname)(curDir);
    if (parentDir === curDir) {
      break;
    }
    curDir = parentDir;
  }
}
__name(scanForPackage, "scanForPackage");
//# sourceMappingURL=helpers.js.map
