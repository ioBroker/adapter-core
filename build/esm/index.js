"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXIT_CODES = exports.Credentials = exports.TokenRefresher = exports.I18n = exports.commonTools = void 0;
exports.getAbsoluteDefaultDataDir = getAbsoluteDefaultDataDir;
exports.getAbsoluteInstanceDataDir = getAbsoluteInstanceDataDir;
const node_path_1 = require("node:path");
const controllerTools_js_1 = require("./controllerTools.js");
const utils = __importStar(require("./utils.js"));
require("@iobroker/types");
// Export utility methods to be used in adapters
var controllerTools_js_2 = require("./controllerTools.js");
Object.defineProperty(exports, "commonTools", { enumerable: true, get: function () { return controllerTools_js_2.commonTools; } });
__exportStar(require("./utils.js"), exports);
exports.I18n = __importStar(require("./i18n.js"));
exports.TokenRefresher = __importStar(require("./TokenRefresher.js"));
exports.Credentials = __importStar(require("./credentials.js"));
/**
 * Returns the absolute path of the data directory for the current host. On linux, this is usually `/opt/iobroker/iobroker-data`.
 */
function getAbsoluteDefaultDataDir() {
    return (0, node_path_1.join)(utils.controllerDir, controllerTools_js_1.controllerToolsInternal.getDefaultDataDir());
}
/**
 * Returns the absolute path of the data directory for the current adapter instance.
 * On linux, this is usually `/opt/iobroker/iobroker-data/<adapterName>.<instanceNr>`
 *
 * @param adapterObjectOrNamespace The adapter instance or namespace string (e.g. "myAdapter.0").
 */
function getAbsoluteInstanceDataDir(adapterObjectOrNamespace) {
    return (0, node_path_1.join)(getAbsoluteDefaultDataDir(), typeof adapterObjectOrNamespace === 'string' ? adapterObjectOrNamespace : adapterObjectOrNamespace.namespace);
}
// TODO: Expose some system utilities here, e.g. for installing npm modules (GH#1)
exports.EXIT_CODES = Object.freeze({
    // Create a shallow copy so compact adapters cannot overwrite the dict in js-controller
    ...(0, controllerTools_js_1.resolveNamedModule)('exitCodes', 'EXIT_CODES'),
});
