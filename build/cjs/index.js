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
var __exportStar = exports && exports.__exportStar || function(m, exports2) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXIT_CODES = exports.Credentials = exports.TokenRefresher = exports.I18n = exports.commonTools = void 0;
exports.getAbsoluteDefaultDataDir = getAbsoluteDefaultDataDir;
exports.getAbsoluteInstanceDataDir = getAbsoluteInstanceDataDir;
const node_path_1 = require("node:path");
const controllerTools_js_1 = require("./controllerTools.js");
const utils = __importStar(require("./utils.js"));
require("@iobroker/types");
var controllerTools_js_2 = require("./controllerTools.js");
Object.defineProperty(exports, "commonTools", { enumerable: true, get: /* @__PURE__ */ __name(function() {
  return controllerTools_js_2.commonTools;
}, "get") });
__exportStar(require("./utils.js"), exports);
exports.I18n = __importStar(require("./i18n.js"));
exports.TokenRefresher = __importStar(require("./TokenRefresher.js"));
exports.Credentials = __importStar(require("./credentials.js"));
function getAbsoluteDefaultDataDir() {
  return (0, node_path_1.join)(utils.controllerDir, controllerTools_js_1.controllerToolsInternal.getDefaultDataDir());
}
__name(getAbsoluteDefaultDataDir, "getAbsoluteDefaultDataDir");
function getAbsoluteInstanceDataDir(adapterObjectOrNamespace) {
  return (0, node_path_1.join)(getAbsoluteDefaultDataDir(), typeof adapterObjectOrNamespace === "string" ? adapterObjectOrNamespace : adapterObjectOrNamespace.namespace);
}
__name(getAbsoluteInstanceDataDir, "getAbsoluteInstanceDataDir");
exports.EXIT_CODES = Object.freeze({
  // Create a shallow copy so compact adapters cannot overwrite the dict in js-controller
  ...(0, controllerTools_js_1.resolveNamedModule)("exitCodes", "EXIT_CODES")
});
//# sourceMappingURL=index.js.map
