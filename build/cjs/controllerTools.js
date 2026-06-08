"use strict";
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
  if (k2 === void 0) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return m[k];
    }, "get") };
  }
  Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
  if (k2 === void 0) k2 = k;
  o[k2] = m[k];
}));
var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
  o["default"] = v;
});
var __importStar = exports && exports.__importStar || /* @__PURE__ */ (function() {
  var ownKeys = /* @__PURE__ */ __name(function(o) {
    ownKeys = Object.getOwnPropertyNames || function(o2) {
      var ar = [];
      for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
      return ar;
    };
    return ownKeys(o);
  }, "ownKeys");
  return function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
    }
    __setModuleDefault(result, mod);
    return result;
  };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonTools = exports.controllerToolsInternal = exports.controllerCommonModulesInternal = void 0;
exports.resolveNamedModule = resolveNamedModule;
const node_path_1 = require("node:path");
const helpers_js_1 = require("./helpers.js");
const utils = __importStar(require("./utils.js"));
const _require_1 = require("#require");
function resolveControllerTools() {
  let importPath = (0, helpers_js_1.tryResolvePackage)(["@iobroker/js-controller-common"]);
  if (importPath) {
    try {
      exports.controllerCommonModulesInternal = (0, _require_1.require)(importPath);
      const { tools } = exports.controllerCommonModulesInternal;
      if (tools) {
        return tools;
      }
    } catch {
    }
  }
  importPath = (0, helpers_js_1.tryResolvePackage)(["@iobroker/js-controller-common"], [(0, node_path_1.join)(utils.controllerDir, "node_modules")]);
  if (importPath) {
    try {
      exports.controllerCommonModulesInternal = (0, _require_1.require)(importPath);
      const { tools } = exports.controllerCommonModulesInternal;
      if (tools) {
        return tools;
      }
    } catch {
    }
  }
  importPath = (0, node_path_1.join)(utils.controllerDir, "lib");
  try {
    const tools = (0, _require_1.require)((0, node_path_1.join)(importPath, "tools"));
    if (tools) {
      return tools;
    }
  } catch {
  }
  throw new Error("Cannot resolve tools module");
}
__name(resolveControllerTools, "resolveControllerTools");
exports.controllerToolsInternal = resolveControllerTools();
function resolveNamedModule(name, exportName = name) {
  if (exports.controllerCommonModulesInternal?.[exportName]) {
    return exports.controllerCommonModulesInternal[exportName];
  }
  const importPaths = [
    // Attempt 1: JS-Controller 6+
    (0, node_path_1.join)(utils.controllerDir, "build/cjs/lib", name),
    // Attempt 2: JS-Controller 4.1+
    (0, node_path_1.join)(utils.controllerDir, "build/lib", name),
    // Attempt 3: JS-Controller <= 4.0
    (0, node_path_1.join)(utils.controllerDir, "lib", name)
  ];
  for (const importPath of importPaths) {
    try {
      const module2 = (0, _require_1.require)(importPath);
      if (module2) {
        return module2;
      }
    } catch {
    }
  }
  throw new Error(`Cannot resolve JS-Controller module ${name}.js`);
}
__name(resolveNamedModule, "resolveNamedModule");
function pattern2RegEx(pattern) {
  return exports.controllerToolsInternal.pattern2RegEx(pattern);
}
__name(pattern2RegEx, "pattern2RegEx");
function getAdapterDir(adapter) {
  return exports.controllerToolsInternal.getAdapterDir(adapter);
}
__name(getAdapterDir, "getAdapterDir");
function getInstalledInfo(hostJsControllerVersion) {
  return exports.controllerToolsInternal.getInstalledInfo(hostJsControllerVersion);
}
__name(getInstalledInfo, "getInstalledInfo");
function isDocker() {
  return exports.controllerToolsInternal.isDocker();
}
__name(isDocker, "isDocker");
function isLocalAddress(ip) {
  return exports.controllerToolsInternal.isLocalAddress(ip);
}
__name(isLocalAddress, "isLocalAddress");
function isListenAllAddress(ip) {
  return exports.controllerToolsInternal.isListenAllAddress(ip);
}
__name(isListenAllAddress, "isListenAllAddress");
function getLocalAddress() {
  return exports.controllerToolsInternal.getLocalAddress();
}
__name(getLocalAddress, "getLocalAddress");
function getListenAllAddress() {
  return exports.controllerToolsInternal.getListenAllAddress();
}
__name(getListenAllAddress, "getListenAllAddress");
exports.commonTools = {
  pattern2RegEx,
  getAdapterDir,
  getInstalledInfo,
  isDocker,
  getLocalAddress,
  getListenAllAddress,
  isLocalAddress,
  isListenAllAddress,
  // TODO: Add more methods from lib/tools.js as needed
  password: resolveNamedModule("password"),
  session: resolveNamedModule("session"),
  zipFiles: resolveNamedModule("zipFiles")
  // TODO: expose more (internal) controller modules as needed
};
//# sourceMappingURL=controllerTools.js.map
