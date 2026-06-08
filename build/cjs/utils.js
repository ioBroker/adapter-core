"use strict";
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
Object.defineProperty(exports, "__esModule", { value: true });
exports.Adapter = exports.adapter = exports.controllerDir = void 0;
exports.getConfig = getConfig;
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const helpers_js_1 = require("./helpers.js");
const _require_1 = require("#require");
function getControllerDir(isInstall) {
  const possibilities = ["iobroker.js-controller", "ioBroker.js-controller"];
  let controllerDir = (0, helpers_js_1.tryResolvePackage)(possibilities);
  if (controllerDir) {
    return controllerDir;
  }
  controllerDir = (0, helpers_js_1.scanForPackage)(possibilities);
  if (controllerDir) {
    return controllerDir;
  }
  if (!isInstall) {
    console.log("Cannot find js-controller");
    return process.exit(10);
  }
  return process.exit();
}
__name(getControllerDir, "getControllerDir");
exports.controllerDir = getControllerDir(!!process?.argv?.includes("--install"));
function resolveAdapterConstructor() {
  let adapterPath = (0, helpers_js_1.tryResolvePackage)(["@iobroker/js-controller-adapter"]);
  if (adapterPath) {
    try {
      const { Adapter } = (0, _require_1.require)(adapterPath);
      if (Adapter) {
        return Adapter;
      }
    } catch {
    }
  }
  adapterPath = (0, helpers_js_1.tryResolvePackage)(["@iobroker/js-controller-adapter"], [(0, node_path_1.join)(exports.controllerDir, "node_modules")]);
  if (adapterPath) {
    try {
      const { Adapter } = (0, _require_1.require)(adapterPath);
      if (Adapter) {
        return Adapter;
      }
    } catch {
    }
  }
  adapterPath = (0, node_path_1.join)(exports.controllerDir, "build/cjs/lib/adapter.js");
  try {
    const Adapter = (0, _require_1.require)(adapterPath);
    if (Adapter) {
      return Adapter;
    }
  } catch {
  }
  adapterPath = (0, node_path_1.join)(exports.controllerDir, "build/lib/adapter.js");
  try {
    const Adapter = (0, _require_1.require)(adapterPath);
    if (Adapter) {
      return Adapter;
    }
  } catch {
  }
  adapterPath = (0, node_path_1.join)(exports.controllerDir, "lib/adapter.js");
  try {
    const Adapter = (0, _require_1.require)(adapterPath);
    if (Adapter) {
      return Adapter;
    }
  } catch {
  }
  throw new Error("Cannot resolve adapter class");
}
__name(resolveAdapterConstructor, "resolveAdapterConstructor");
function getConfig() {
  return JSON.parse((0, node_fs_1.readFileSync)((0, node_path_1.join)(exports.controllerDir, "conf/iobroker.json"), "utf8"));
}
__name(getConfig, "getConfig");
exports.adapter = resolveAdapterConstructor();
exports.Adapter = exports.adapter;
//# sourceMappingURL=utils.js.map
