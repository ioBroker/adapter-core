/// <reference types="@iobroker/types" />
import * as path from "path";
import { controllerToolsInternal, resolveNamedModule } from "./controllerTools";
import { ExitCodes } from "./exitCodes";
import * as utils from "./utils";

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

export const EXIT_CODES: ExitCodes = Object.freeze({
	// Create a shallow copy so compact adapters cannot overwrite the dict in js-controller
	...resolveNamedModule("exitCodes", "EXIT_CODES"),
});
