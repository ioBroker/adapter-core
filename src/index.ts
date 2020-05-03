import * as path from "path";
import { ExitCodes } from "./exitCodes";
import * as utils from "./utils";
/* eslint-disable @typescript-eslint/no-var-requires */

// Export all methods that used to be in utils.js
export * from "./utils";

// Export some additional utility methods

const controllerTools = require(path.join(utils.controllerDir, "lib/tools"));

/**
 * Returns the absolute path of the data directory for the current host. On linux, this is usually `/opt/iobroker/iobroker-data`.
 */
export function getAbsoluteDefaultDataDir(): string {
	return path.join(utils.controllerDir, controllerTools.getDefaultDataDir());
}

/**
 * Returns the absolute path of the data directory for the current adapter instance.
 * On linux, this is usually `/opt/iobroker/iobroker-data/<adapterName>.<instanceNr>`
 */
export function getAbsoluteInstanceDataDir(
	adapterObject: ioBroker.Adapter,
): string {
	return path.join(getAbsoluteDefaultDataDir(), adapterObject.namespace);
}

// TODO: Expose some system utilities here, e.g. for installing npm modules (GH#1)

export const EXIT_CODES = {
	// Create a shallow copy so compact adapters cannot overwrite the dict in js-controller
	...require(path.join(utils.controllerDir, "lib/exitCodes")),
} as ExitCodes;
