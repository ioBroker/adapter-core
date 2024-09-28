import { join } from 'node:path';
import { controllerToolsInternal, resolveNamedModule } from './controllerTools.js';
import * as utils from './utils.js';
import '@iobroker/types';
// Export utility methods to be used in adapters
export { commonTools } from './controllerTools.js';
export * from './utils.js';
export * as I18n from './i18n.js';
/**
 * Returns the absolute path of the data directory for the current host. On linux, this is usually `/opt/iobroker/iobroker-data`.
 */
export function getAbsoluteDefaultDataDir() {
    return join(utils.controllerDir, controllerToolsInternal.getDefaultDataDir());
}
/**
 * Returns the absolute path of the data directory for the current adapter instance.
 * On linux, this is usually `/opt/iobroker/iobroker-data/<adapterName>.<instanceNr>`
 *
 * @param adapterObject The adapter instance
 */
export function getAbsoluteInstanceDataDir(adapterObject) {
    return join(getAbsoluteDefaultDataDir(), adapterObject.namespace);
}
// TODO: Expose some system utilities here, e.g. for installing npm modules (GH#1)
export const EXIT_CODES = Object.freeze({
    // Create a shallow copy so compact adapters cannot overwrite the dict in js-controller
    ...resolveNamedModule('exitCodes', 'EXIT_CODES'),
});
