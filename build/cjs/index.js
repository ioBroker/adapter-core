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
var __exportStar = exports && exports.__exportStar || function(m, exports2) {
  for (var p in m)
    if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
      __createBinding(exports2, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXIT_CODES = exports.getAbsoluteInstanceDataDir = exports.getAbsoluteDefaultDataDir = exports.commonTools = void 0;
const path = __importStar(require("path"));
const controllerTools_1 = require("./controllerTools");
const utils = __importStar(require("./utils"));
require("@iobroker/types");
var controllerTools_2 = require("./controllerTools");
Object.defineProperty(exports, "commonTools", { enumerable: true, get: function() {
  return controllerTools_2.commonTools;
} });
__exportStar(require("./utils"), exports);
function getAbsoluteDefaultDataDir() {
  return path.join(utils.controllerDir, controllerTools_1.controllerToolsInternal.getDefaultDataDir());
}
exports.getAbsoluteDefaultDataDir = getAbsoluteDefaultDataDir;
function getAbsoluteInstanceDataDir(adapterObject) {
  return path.join(getAbsoluteDefaultDataDir(), adapterObject.namespace);
}
exports.getAbsoluteInstanceDataDir = getAbsoluteInstanceDataDir;
exports.EXIT_CODES = Object.freeze(Object.assign({}, (0, controllerTools_1.resolveNamedModule)("exitCodes", "EXIT_CODES")));
//# sourceMappingURL=index.js.map
