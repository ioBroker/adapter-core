import * as fs from "node:fs";
import * as path from "node:path";
import { createRequire } from "node:module";
import * as url from "node:url";
// eslint-disable-next-line unicorn/prefer-module
const require = createRequire(import.meta.url || "file://" + __filename);

const thisDir = url.fileURLToPath(
	// eslint-disable-next-line unicorn/prefer-module
	new URL(".", import.meta.url || "file://" + __filename),
);

/**
 * Tries to resolve a package using Node.js resolution.
 * Directory names differing from the package name and alternate lookup paths can be passed.
 */
export function tryResolvePackage(
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

/**
 * Scans for a package by walking up the directory tree and inspecting package.json
 * Directory names differing from the package name and an alternate start dir can be passed.
 */
export function scanForPackage(
	possiblePaths: string[],
	startDir: string = thisDir,
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
