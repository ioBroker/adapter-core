"use strict";
var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
  if (k2 === void 0)
    k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = { enumerable: true, get: function() {
      return m[k];
    } };
  }
  Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
  if (k2 === void 0)
    k2 = k;
  o[k2] = m[k];
});
var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
} : function(o, v) {
  o["default"] = v;
});
var __importStar = exports && exports.__importStar || function(mod) {
  if (mod && mod.__esModule)
    return mod;
  var result = {};
  if (mod != null) {
    for (var k in mod)
      if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
        __createBinding(result, mod, k);
  }
  __setModuleDefault(result, mod);
  return result;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Adapter = exports.adapter = exports.getConfig = exports.controllerDir = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const helpers_1 = require("./helpers");
function getControllerDir(isInstall) {
  const possibilities = ["iobroker.js-controller", "ioBroker.js-controller"];
  let controllerDir = (0, helpers_1.tryResolvePackage)(possibilities);
  if (controllerDir)
    return controllerDir;
  controllerDir = (0, helpers_1.scanForPackage)(possibilities);
  if (controllerDir)
    return controllerDir;
  if (!isInstall) {
    console.log("Cannot find js-controller");
    return process.exit(10);
  } else {
    return process.exit();
  }
}
exports.controllerDir = getControllerDir(!!((_a = process === null || process === void 0 ? void 0 : process.argv) === null || _a === void 0 ? void 0 : _a.includes("--install")));
function resolveAdapterConstructor() {
  let adapterPath = (0, helpers_1.tryResolvePackage)(["@iobroker/js-controller-adapter"]);
  if (adapterPath) {
    try {
      const { Adapter } = require(adapterPath);
      if (Adapter)
        return Adapter;
    } catch (_a2) {
    }
  }
  adapterPath = (0, helpers_1.tryResolvePackage)(["@iobroker/js-controller-adapter"], [path.join(exports.controllerDir, "node_modules")]);
  if (adapterPath) {
    try {
      const { Adapter } = require(adapterPath);
      if (Adapter)
        return Adapter;
    } catch (_b) {
    }
  }
  adapterPath = path.join(exports.controllerDir, "build/cjs/lib/adapter.js");
  try {
    const Adapter = require(adapterPath);
    if (Adapter)
      return Adapter;
  } catch (_c) {
  }
  adapterPath = path.join(exports.controllerDir, "build/lib/adapter.js");
  try {
    const Adapter = require(adapterPath);
    if (Adapter)
      return Adapter;
  } catch (_d) {
  }
  adapterPath = path.join(exports.controllerDir, "lib/adapter.js");
  try {
    const Adapter = require(adapterPath);
    if (Adapter)
      return Adapter;
  } catch (_e) {
  }
  throw new Error("Cannot resolve adapter class");
  return process.exit(10);
}
function getConfig() {
  return JSON.parse(fs.readFileSync(path.join(exports.controllerDir, "conf/iobroker.json"), "utf8"));
}
exports.getConfig = getConfig;
exports.adapter = resolveAdapterConstructor();
exports.Adapter = exports.adapter;
//# sourceMappingURL=utils.js.map
