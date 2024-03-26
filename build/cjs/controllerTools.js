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
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonTools = exports.resolveNamedModule = exports.controllerToolsInternal = exports.controllerCommonModulesInternal = void 0;
const path = __importStar(require("path"));
const helpers_1 = require("./helpers");
const utils = __importStar(require("./utils"));
function resolveControllerTools() {
  let importPath = (0, helpers_1.tryResolvePackage)(["@iobroker/js-controller-common"]);
  if (importPath) {
    try {
      exports.controllerCommonModulesInternal = require(importPath);
      const { tools } = exports.controllerCommonModulesInternal;
      if (tools)
        return tools;
    } catch (_a) {
    }
  }
  importPath = (0, helpers_1.tryResolvePackage)(["@iobroker/js-controller-common"], [path.join(utils.controllerDir, "node_modules")]);
  if (importPath) {
    try {
      exports.controllerCommonModulesInternal = require(importPath);
      const { tools } = exports.controllerCommonModulesInternal;
      if (tools)
        return tools;
    } catch (_b) {
    }
  }
  importPath = path.join(utils.controllerDir, "lib");
  try {
    const tools = require(path.join(importPath, "tools"));
    if (tools)
      return tools;
  } catch (_c) {
  }
  throw new Error("Cannot resolve tools module");
}
exports.controllerToolsInternal = resolveControllerTools();
function resolveNamedModule(name, exportName = name) {
  if (exports.controllerCommonModulesInternal === null || exports.controllerCommonModulesInternal === void 0 ? void 0 : exports.controllerCommonModulesInternal[exportName])
    return exports.controllerCommonModulesInternal[exportName];
  const importPaths = [
    path.join(utils.controllerDir, "build/cjs/lib", name),
    path.join(utils.controllerDir, "build/lib", name),
    path.join(utils.controllerDir, "lib", name)
  ];
  for (const importPath of importPaths) {
    try {
      const module2 = require(importPath);
      if (module2)
        return module2;
    } catch (_a) {
    }
  }
  throw new Error(`Cannot resolve JS-Controller module ${name}.js`);
}
exports.resolveNamedModule = resolveNamedModule;
function pattern2RegEx(pattern) {
  return exports.controllerToolsInternal.pattern2RegEx(pattern);
}
function getAdapterDir(adapter) {
  return exports.controllerToolsInternal.getAdapterDir(adapter);
}
function getInstalledInfo(hostJsControllerVersion) {
  return exports.controllerToolsInternal.getInstalledInfo(hostJsControllerVersion);
}
function isDocker() {
  return exports.controllerToolsInternal.isDocker();
}
function isLocalAddress(ip) {
  return exports.controllerToolsInternal.isLocalAddress(ip);
}
function isListenAllAddress(ip) {
  return exports.controllerToolsInternal.isListenAllAddress(ip);
}
function getLocalAddress() {
  return exports.controllerToolsInternal.getLocalAddress();
}
function getListenAllAddress() {
  return exports.controllerToolsInternal.getListenAllAddress();
}
exports.commonTools = {
  pattern2RegEx,
  getAdapterDir,
  getInstalledInfo,
  isDocker,
  getLocalAddress,
  getListenAllAddress,
  isLocalAddress,
  isListenAllAddress,
  password: resolveNamedModule("password"),
  letsEncrypt: resolveNamedModule("letsencrypt"),
  session: resolveNamedModule("session"),
  zipFiles: resolveNamedModule("zipFiles")
};
//# sourceMappingURL=controllerTools.js.map
