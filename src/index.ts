import * as path from "path";
import { ExitCodes } from "./exitCodes";
import { tryResolvePackage } from "./helpers";
import * as utils from "./utils";
/* eslint-disable @typescript-eslint/no-var-requires */

// Export all methods that used to be in utils.js
export * from "./utils";

// Export some additional utility methods

function resolveControllerTools(): any | never {
	// Attempt 1: Resolve @iobroker/js-controller-common from here - JS-Controller 4.1+
	let importPath = tryResolvePackage(["@iobroker/js-controller-common"]);
	if (importPath) {
		try {
			const { tools } = require(importPath);
			if (tools) return tools;
		} catch {
			// did not work, continue
		}
	}

	// Attempt 2: Resolve @iobroker/js-controller-common in JS-Controller dir - JS-Controller 4.1+
	importPath = tryResolvePackage(
		["@iobroker/js-controller-common"],
		[path.join(utils.controllerDir, "node_modules")],
	);
	if (importPath) {
		try {
			const { tools } = require(importPath);
			if (tools) return tools;
		} catch {
			// did not work, continue
		}
	}

	// Attempt 3: Legacy resolve - until JS-Controller 4.0
	importPath = path.join(utils.controllerDir, "lib/tools");
	try {
		// This was a default export prior to the TS migration
		const tools = require(importPath);
		if (tools) return tools;
	} catch {
		// did not work, continue
	}

	throw new Error("Cannot resolve tools module");
	return process.exit(10);
}

const controllerTools = resolveControllerTools();

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

function resolveExitCodes(): ExitCodes | never {
	// Attempt 1: Resolve @iobroker/js-controller-common from here - JS-Controller 4.1+
	let importPath = tryResolvePackage(["@iobroker/js-controller-common"]);
	if (importPath) {
		try {
			const { EXIT_CODES } = require(importPath);
			if (EXIT_CODES) return EXIT_CODES;
		} catch {
			// did not work, continue
		}
	}

	// Attempt 2: Resolve @iobroker/js-controller-common in JS-Controller dir - JS-Controller 4.1+
	importPath = tryResolvePackage(
		["@iobroker/js-controller-common"],
		[path.join(utils.controllerDir, "node_modules")],
	);
	if (importPath) {
		try {
			const { EXIT_CODES } = require(importPath);
			if (EXIT_CODES) return EXIT_CODES;
		} catch {
			// did not work, continue
		}
	}

	// Attempt 3: Legacy resolve - until JS-Controller 4.0
	importPath = path.join(utils.controllerDir, "lib/exitCodes");
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
