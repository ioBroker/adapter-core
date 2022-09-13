import * as path from "path";
import { controllerToolsInternal } from "./controllerTools";
import { ExitCodes } from "./exitCodes";
import * as utils from "./utils";
/* eslint-disable @typescript-eslint/no-var-requires */

// Export utility methods to be used in adapters
export { commonTools } from "./controllerTools";
export * from "./utils";

/**
 * Returns the absolute path of the data directory for the current host. On linux, this is usually `/opt/iobroker/iobroker-data`.
 */
export function getAbsoluteDefaultDataDir(): string {
	return path.join(
		utils.controllerDir,
		controllerToolsInternal.getDefaultDataDir(),
	);
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

function resolveExitCodes(): ExitCodes | never {
	if ("EXIT_CODES" in controllerToolsInternal)
		return controllerToolsInternal.EXIT_CODES;

	// We're dealing with JS-Controller <= 4.0
	const importPath = path.join(utils.controllerDir, "lib/exitCodes");
	try {
		// This was a default export prior to the TS migration
		const EXIT_CODES = require(importPath);
		if (EXIT_CODES) return EXIT_CODES;
	} catch {
		// did not work, continue
	}

	throw new Error("Cannot resolve EXIT_CODES");
	return process.exit(10);
}

export const EXIT_CODES = Object.freeze({
	// Create a shallow copy so compact adapters cannot overwrite the dict in js-controller
	...resolveExitCodes(),
});
