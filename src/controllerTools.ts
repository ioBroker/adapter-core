import * as path from "path";
import { tryResolvePackage } from "./helpers";
import * as utils from "./utils";
/* eslint-disable @typescript-eslint/no-var-requires */

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
	importPath = path.join(utils.controllerDir, "lib");
	try {
		// This was a default export prior to the TS migration
		const tools = require(path.join(importPath, "tools"));
		if (tools) return tools;
	} catch {
		// did not work, continue
	}

	throw new Error("Cannot resolve tools module");
	return process.exit(10);
}

/** The collection of utility functions in JS-Controller, formerly `lib/tools.js` */
export const controllerToolsInternal = resolveControllerTools();

// Export a subset of the utilties in controllerTools

function resolveNamedModule(name: string): any {
	// The requested module might be moved to @iobroker/js-controller-common and exported from there
	if (name in controllerToolsInternal) return controllerToolsInternal[name];

	// Otherwise it was not moved yet, or we're dealing with JS-Controller <= 4.0

	// Attempt 1: JS-Controller 4.1+
	let importPath = path.join(utils.controllerDir, "build/lib", name);
	try {
		// This was a default export prior to the TS migration
		const module = require(importPath);
		if (module) return module;
	} catch {
		// did not work, continue
	}

	// Attempt 2: JS-Controller <= 4.0
	importPath = path.join(utils.controllerDir, "lib", name);
	try {
		// This was a default export prior to the TS migration
		const module = require(importPath);
		if (module) return module;
	} catch {
		// did not work, continue
	}

	throw new Error(`Cannot resolve JS-Controller module ${name}.js`);
	return process.exit(10);
}

// TODO: Import types from @iobroker/js-controller-common and iobroker.js-controller

/**
 * Converts a pattern to match object IDs into a RegEx string that can be used in `new RegExp(...)`
 * @param pattern The pattern to convert
 */
function pattern2RegEx(pattern: string): string {
	return controllerToolsInternal.tools.pattern2RegEx(pattern);
}

export const commonTools = {
	pattern2RegEx,
	// TODO: Add more methods from lib/tools.js as needed

	password: resolveNamedModule("password"),
	letsEncrypt: resolveNamedModule("letsencrypt"),
	session: resolveNamedModule("session"),
	zipFiles: resolveNamedModule("zipFiles"),
	// TODO: expose more (internal) controller modules as needed
};
