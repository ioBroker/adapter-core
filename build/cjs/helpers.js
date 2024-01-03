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
exports.scanForPackage = exports.tryResolvePackage = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function tryResolvePackage(possiblePaths, lookupPaths) {
  for (const pkg of possiblePaths) {
    try {
      const possiblePath = require.resolve(`${pkg}/package.json`, (lookupPaths === null || lookupPaths === void 0 ? void 0 : lookupPaths.length) ? { paths: lookupPaths } : void 0);
      if (fs.existsSync(possiblePath)) {
        return path.dirname(possiblePath);
      }
    } catch (_a) {
    }
  }
}
exports.tryResolvePackage = tryResolvePackage;
function scanForPackage(possiblePaths, startDir = __dirname) {
  let curDir = path.join(startDir, "../node_modules");
  while (true) {
    for (const pkg of possiblePaths) {
      const possiblePath = path.join(curDir, pkg, "package.json");
      try {
        if (fs.existsSync(possiblePath) && JSON.parse(fs.readFileSync(possiblePath, "utf8")).name === pkg.toLowerCase()) {
          return path.dirname(possiblePath);
        }
      } catch (_a) {
      }
    }
    const parentDir = path.dirname(curDir);
    if (parentDir === curDir) {
      break;
    }
    curDir = parentDir;
  }
}
exports.scanForPackage = scanForPackage;
//# sourceMappingURL=helpers.js.map
