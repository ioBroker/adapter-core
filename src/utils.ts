// tslint:disable:unified-signatures
// tslint:disable:no-var-requires
import * as fs from "fs";
import * as path from "path";

/// <reference path="./ioBroker.d.ts" />

// Get js-controller directory to load libs
function getControllerDir(isInstall: boolean): string | never {
	// Find the js-controller location
	const possibilities = [
		"iobroker.js-controller",
		"ioBroker.js-controller",
	];
	let controllerPath: string | undefined;
	for (const pkg of possibilities) {
		try {
			const possiblePath = require.resolve(pkg);
			if (fs.existsSync(possiblePath)) {
				controllerPath = possiblePath;
				break;
			}
		} catch { /* not found */ }
	}
	if (controllerPath == undefined) {
		if (!isInstall) {
			console.log("Cannot find js-controller");
			process.exit(10);
		} else {
			process.exit();
		}
		// We need to please TypeScript.
		throw new Error("this never not get executed");
	}
	// we found the controller
	return path.dirname(controllerPath);
}

// Read controller configuration file
export const controllerDir = getControllerDir(typeof process !== "undefined" && process.argv && process.argv.indexOf("--install") !== -1);
export function getConfig(): {} {
	return JSON.parse(
		fs.readFileSync(path.join(controllerDir, "conf/iobroker.json"), "utf8"),
	);
}

interface AdapterConstructor {
	(adapterName: string): ioBroker.Adapter;
	(adapterOptions: ioBroker.AdapterOptions): ioBroker.Adapter;
}
export const adapter: AdapterConstructor = require(path.join(controllerDir, "lib/adapter.js"));
