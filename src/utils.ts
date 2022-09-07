/* eslint-disable @typescript-eslint/no-var-requires */

import * as fs from "fs";
import * as path from "path";

function tryResolvePackage(
	possiblePaths: string[],
	lookupPaths?: string[],
): string | undefined {
	for (const pkg of possiblePaths) {
		try {
			// package.json is guaranteed to be in the module root folder
			// so once that is resolved, take the dirname and we're done
			const possiblePath = require.resolve(
				`${pkg}/package.json`,
				lookupPaths?.length ? { paths: lookupPaths } : undefined,
			);
			if (fs.existsSync(possiblePath)) {
				return path.dirname(possiblePath);
			}
		} catch {
			/* not found */
		}
	}
}

function scanForPackage(
	possiblePaths: string[],
	startDir: string = __dirname,
): string | undefined {
	// We start in the node_modules subfolder of adapter-core, which is the deepest we should be able to expect the controller
	let curDir = path.join(startDir, "../node_modules");
	while (true) {
		for (const pkg of possiblePaths) {
			const possiblePath = path.join(curDir, pkg, "package.json");
			try {
				// If package.json exists in the directory and its name field matches, we've found js-controller
				if (
					fs.existsSync(possiblePath) &&
					JSON.parse(fs.readFileSync(possiblePath, "utf8")).name ===
						pkg.toLowerCase()
				) {
					return path.dirname(possiblePath);
				}
			} catch {
				// don't care
			}
		}

		// Nothing found here, go up one level
		const parentDir = path.dirname(curDir);
		if (parentDir === curDir) {
			// we've reached the root without finding js-controller
			break;
		}
		curDir = parentDir;
	}
}

/**
 * Resolves the root directory of JS-Controller and returns it or exits the process
 * @param isInstall Whether the adapter is run in "install" mode or if it should execute normally
 */
function getControllerDir(isInstall: boolean): string | never {
	// Find the js-controller location
	const possibilities = ["iobroker.js-controller", "ioBroker.js-controller"];
	// First try to let Node.js resolve the package by itself
	let controllerDir = tryResolvePackage(possibilities);
	// Apparently, checking vs null/undefined may miss the odd case of controllerPath being ""
	// Thus we check for falsyness, which includes failing on an empty path
	if (controllerDir) return controllerDir;

	// As a fallback solution, we walk up the directory tree until we reach the root or find js-controller
	controllerDir = scanForPackage(possibilities);
	if (controllerDir) return controllerDir;

	if (!isInstall) {
		console.log("Cannot find js-controller");
		return process.exit(10);
	} else {
		return process.exit();
	}
}

/** The root directory of JS-Controller */
export const controllerDir = getControllerDir(
	!!process?.argv?.includes("--install"),
);

function resolveAdapterConstructor(): any | never {
	// Attempt 1: Resolve @iobroker/js-controller-adapter from here - JS-Controller 4.1+
	let adapterPath = tryResolvePackage(["@iobroker/js-controller-adapter"]);
	if (adapterPath) {
		try {
			const { Adapter } = require(adapterPath);
			if (Adapter)
				return console.log("found adapter, attempt 1"), Adapter;
		} catch {
			// did not work, continue
		}
	}

	// Attempt 2: Resolve @iobroker/js-controller-adapter in JS-Controller dir - JS-Controller 4.1+
	adapterPath = tryResolvePackage(
		["@iobroker/js-controller-adapter"],
		[path.join(controllerDir, "node_modules")],
	);
	if (adapterPath) {
		try {
			const { Adapter } = require(adapterPath);
			if (Adapter)
				return console.log("found adapter, attempt 2"), Adapter;
		} catch {
			// did not work, continue
		}
	}

	// Attempt 3: Legacy resolve - until JS-Controller 4.0
	adapterPath = path.join(controllerDir, "lib/adapter.js");
	try {
		// This was a default export prior to the TS migration
		const Adapter = require(adapterPath);
		if (Adapter) return console.log("found adapter, attempt 3"), Adapter;
	} catch {
		// did not work, continue
	}

	// Attempt 4: JS-Controller 4.1+ with adapter stub
	adapterPath = path.join(controllerDir, "build/lib/adapter.js");
	try {
		// This was a default export prior to the TS migration
		const Adapter = require(adapterPath);
		if (Adapter) return console.log("found adapter, attempt 4"), Adapter;
	} catch {
		// did not work, continue
	}

	throw new Error("Cannot resolve adapter class");
	return process.exit(10);
}

/** Reads the configuration file of JS-Controller */
export function getConfig(): Record<string, any> {
	return JSON.parse(
		fs.readFileSync(path.join(controllerDir, "conf/iobroker.json"), "utf8"),
	);
}

/**
 * This type is used to include and exclude the states and objects cache from the adaptert type definition depending on the creation options
 */
export interface AdapterInstance<
	HasObjectsCache extends boolean | undefined = undefined,
	HasStatesCache extends boolean | undefined = undefined,
> extends Omit<ioBroker.Adapter, "oObjects" | "oStates"> {
	oObjects: HasObjectsCache extends true
		? Exclude<ioBroker.Adapter["oObjects"], undefined>
		: undefined;
	oStates: HasStatesCache extends true
		? Exclude<ioBroker.Adapter["oStates"], undefined>
		: undefined;
}

/** This type augments the ioBroker Adapter options to accept two generics for the objects and states cache */
export type AdapterOptions<
	HasObjectsCache extends boolean | undefined = undefined,
	HasStatesCache extends boolean | undefined = undefined,
> = Omit<ioBroker.AdapterOptions, "objects" | "states"> &
	(true extends HasObjectsCache
		? { objects: true }
		: { objects?: HasObjectsCache }) &
	(true extends HasStatesCache
		? { states: true }
		: { states?: HasStatesCache });

/** Selects the correct instance type depending on the constructor params */
interface AdapterConstructor {
	new <
		HasObjectsCache extends boolean | undefined = undefined,
		HasStatesCache extends boolean | undefined = undefined,
	>(
		adapterOptions:
			| AdapterOptions<HasObjectsCache, HasStatesCache>
			| string,
	): AdapterInstance<HasObjectsCache, HasStatesCache>;

	<
		HasObjectsCache extends boolean | undefined = undefined,
		HasStatesCache extends boolean | undefined = undefined,
	>(
		adapterOptions:
			| AdapterOptions<HasObjectsCache, HasStatesCache>
			| string,
	): AdapterInstance<HasObjectsCache, HasStatesCache>;
}

/** Creates a new adapter instance */
export const adapter: AdapterConstructor = resolveAdapterConstructor();
/** Creates a new adapter instance */
export const Adapter = adapter;
