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
var utils_exports = {};
__export(utils_exports, {
  Adapter: () => Adapter,
  adapter: () => adapter,
  controllerDir: () => controllerDir,
  getConfig: () => getConfig
});
module.exports = __toCommonJS(utils_exports);
var fs = __toESM(require("node:fs"));
var path = __toESM(require("node:path"));
var import_node_module = require("node:module");
var import_helpers = require("./helpers");
const import_meta = {};
var _a;
var require2 = (0, import_node_module.createRequire)(import_meta.url || "file://" + __filename);
function getControllerDir(isInstall) {
  var possibilities = ["iobroker.js-controller", "ioBroker.js-controller"];
  var controllerDir2 = (0, import_helpers.tryResolvePackage)(possibilities);
  if (controllerDir2)
    return controllerDir2;
  controllerDir2 = (0, import_helpers.scanForPackage)(possibilities);
  if (controllerDir2)
    return controllerDir2;
  if (!isInstall) {
    console.log("Cannot find js-controller");
    return process.exit(10);
  } else {
    return process.exit();
  }
}
var controllerDir = getControllerDir(!!((_a = process === null || process === void 0 ? void 0 : process.argv) === null || _a === void 0 ? void 0 : _a.includes("--install")));
function resolveAdapterConstructor() {
  var adapterPath = (0, import_helpers.tryResolvePackage)(["@iobroker/js-controller-adapter"]);
  if (adapterPath) {
    try {
      var Adapter_1 = require2(adapterPath).Adapter;
      if (Adapter_1)
        return Adapter_1;
    } catch (_a2) {
    }
  }
  adapterPath = (0, import_helpers.tryResolvePackage)(["@iobroker/js-controller-adapter"], [path.join(controllerDir, "node_modules")]);
  if (adapterPath) {
    try {
      var Adapter_2 = require2(adapterPath).Adapter;
      if (Adapter_2)
        return Adapter_2;
    } catch (_b) {
    }
  }
  adapterPath = path.join(controllerDir, "build/cjs/lib/adapter.js");
  try {
    var Adapter_3 = require2(adapterPath);
    if (Adapter_3)
      return Adapter_3;
  } catch (_c) {
  }
  adapterPath = path.join(controllerDir, "build/lib/adapter.js");
  try {
    var Adapter_4 = require2(adapterPath);
    if (Adapter_4)
      return Adapter_4;
  } catch (_d) {
  }
  adapterPath = path.join(controllerDir, "lib/adapter.js");
  try {
    var Adapter_5 = require2(adapterPath);
    if (Adapter_5)
      return Adapter_5;
  } catch (_e) {
  }
  throw new Error("Cannot resolve adapter class");
  return process.exit(10);
}
function getConfig() {
  return JSON.parse(fs.readFileSync(path.join(controllerDir, "conf/iobroker.json"), "utf8"));
}
var adapter = resolveAdapterConstructor();
var Adapter = adapter;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Adapter,
  adapter,
  controllerDir,
  getConfig
});
//# sourceMappingURL=utils.js.map
