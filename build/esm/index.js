var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import * as path from "node:path";
import { controllerToolsInternal, resolveNamedModule, } from "./controllerTools.js";
import * as utils from "./utils.js";
import "@iobroker/types";
// Export utility methods to be used in adapters
export { commonTools } from "./controllerTools.js";
export * from "./utils.js";
/**
 * Returns the absolute path of the data directory for the current host. On linux, this is usually `/opt/iobroker/iobroker-data`.
 */
export function getAbsoluteDefaultDataDir() {
    return path.join(utils.controllerDir, controllerToolsInternal.getDefaultDataDir());
}
/**
 * Returns the absolute path of the data directory for the current adapter instance.
 * On linux, this is usually `/opt/iobroker/iobroker-data/<adapterName>.<instanceNr>`
 */
export function getAbsoluteInstanceDataDir(adapterObject) {
    return path.join(getAbsoluteDefaultDataDir(), adapterObject.namespace);
}
// TODO: Expose some system utilities here, e.g. for installing npm modules (GH#1)
export var EXIT_CODES = Object.freeze(__assign({}, resolveNamedModule("exitCodes", "EXIT_CODES")));
