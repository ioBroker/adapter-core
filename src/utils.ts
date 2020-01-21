import * as fs from "fs";
import * as path from "path";

/**
 * Resolves the root directory of JS-Controller and returns it or exits the process
 * @param isInstall Whether the adapter is run in "install" mode or if it should execute normally
 */
function getControllerDir(isInstall: boolean): string | never {
	// Find the js-controller location
	const possibilities = ["iobroker.js-controller", "ioBroker.js-controller"];
	let controllerPath: string | undefined;
	for (const pkg of possibilities) {
		try {
			const possiblePath = require.resolve(pkg);
			if (fs.existsSync(possiblePath)) {
				controllerPath = possiblePath;
				break;
			}
		} catch {
			/* not found */
		}
	}
	// Apparently, checking vs null/undefined may miss the odd case of controllerPath being ""
	// Thus we check for falsyness, which includes failing on an empty path
	if (!controllerPath) {
		if (!isInstall) {
			console.log("Cannot find js-controller");
			return process.exit(10);
		} else {
			return process.exit();
		}
	}
	// we found the controller
	return path.dirname(controllerPath);
}

/** The root directory of JS-Controller */
export const controllerDir = getControllerDir(
	typeof process !== "undefined" &&
		process.argv &&
		process.argv.indexOf("--install") !== -1,
);

/** Reads the configuration file of JS-Controller */
export function getConfig(): Record<string, any> {
	return JSON.parse(
		fs.readFileSync(path.join(controllerDir, "conf/iobroker.json"), "utf8"),
	);
}

/**
 * This type is used to include and exclude the states and objects cache from the adaptert type definition depending on the creation options
 */
// oObjects and oStates only exist if the corresponding options are set to true
type AdapterInstanceType<T extends ioBroker.AdapterOptions> = T extends {
	objects: true;
	states: true;
}
	? ioBroker.Adapter & {
			oObjects: Exclude<ioBroker.Adapter["oObjects"], undefined>;
			oStates: Exclude<ioBroker.Adapter["oStates"], undefined>;
	  }
	: T extends { objects: true }
	? Omit<ioBroker.Adapter, "oStates"> & {
			oObjects: Exclude<ioBroker.Adapter["oObjects"], undefined>;
	  }
	: T extends { states: true }
	? Omit<ioBroker.Adapter, "oObjects"> & {
			oStates: Exclude<ioBroker.Adapter["oStates"], undefined>;
	  }
	: Omit<ioBroker.Adapter, "oObjects" | "oStates">;

interface AdapterConstructor {
	new (adapterName: string): ioBroker.Adapter;
	new <T extends ioBroker.AdapterOptions>(
		adapterOptions: T,
	): AdapterInstanceType<T>;
	(adapterName: string): ioBroker.Adapter;
	<T extends ioBroker.AdapterOptions>(
		adapterOptions: ioBroker.AdapterOptions,
	): AdapterInstanceType<T>;
}
/** Creates a new adapter instance */
// eslint-disable-next-line @typescript-eslint/no-var-requires
export const adapter: AdapterConstructor = require(path.join(
	controllerDir,
	"lib/adapter.js",
));
/** Creates a new adapter instance */
export const Adapter = adapter;
