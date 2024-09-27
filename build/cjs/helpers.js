"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var helpers_exports = {};
__export(helpers_exports, {
  scanForPackage: () => scanForPackage,
  tryResolvePackage: () => tryResolvePackage
});
module.exports = __toCommonJS(helpers_exports);
var fs = __toESM(require("node:fs"));
var path = __toESM(require("node:path"));
var import_node_module = require("node:module");
var url = __toESM(require("node:url"));
const import_meta = {};
const require2 = (0, import_node_module.createRequire)(import_meta.url || `file://${__filename}`);
const thisDir = url.fileURLToPath(
  new URL(".", import_meta.url || `file://${__filename}`)
);
function tryResolvePackage(possiblePaths, lookupPaths) {
  for (const pkg of possiblePaths) {
    try {
      const possiblePath = require2.resolve(`${pkg}/package.json`, (lookupPaths == null ? void 0 : lookupPaths.length) ? { paths: lookupPaths } : void 0);
      if (fs.existsSync(possiblePath)) {
        return path.dirname(possiblePath);
      }
    } catch {
    }
  }
}
function scanForPackage(possiblePaths, startDir = thisDir) {
  let curDir = path.join(startDir, "../node_modules");
  while (true) {
    for (const pkg of possiblePaths) {
      const possiblePath = path.join(curDir, pkg, "package.json");
      try {
        if (fs.existsSync(possiblePath) && JSON.parse(fs.readFileSync(possiblePath, "utf8")).name === pkg.toLowerCase()) {
          return path.dirname(possiblePath);
        }
      } catch {
      }
    }
    const parentDir = path.dirname(curDir);
    if (parentDir === curDir) {
      break;
    }
    curDir = parentDir;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  scanForPackage,
  tryResolvePackage
});
//# sourceMappingURL=helpers.js.map
