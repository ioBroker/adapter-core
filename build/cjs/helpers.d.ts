/**
 * Tries to resolve a package using Node.js resolution.
 * Directory names differing from the package name and alternate lookup paths can be passed.
 */
export declare function tryResolvePackage(possiblePaths: string[], lookupPaths?: string[]): string | undefined;
/**
 * Scans for a package by walking up the directory tree and inspecting package.json
 * Directory names differing from the package name and an alternate start dir can be passed.
 */
export declare function scanForPackage(possiblePaths: string[], startDir?: string): string | undefined;
