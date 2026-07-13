import { join } from 'node:path';
import { createRequire } from 'node:module';
import { tryResolvePackage } from './helpers.js';
import { isListenAllAddress, isLocalAddress, pattern2RegEx } from './tools.js';
import * as utils from './utils.js';
import type { tools as ControllerToolsNamespace } from '@iobroker/js-controller-common-db';

const require = createRequire(import.meta.url || `file://${__filename}`);

/**
 * The type of JS-Controller's `tools` module (formerly `lib/tools.js`), i.e. the full set of utility
 * functions it exposes - not just the ones adapter-core wraps in `commonTools`.
 *
 * The `tools` namespace is defined in `@iobroker/js-controller-common-db` (and re-exported by
 * `@iobroker/js-controller-common`). We reference common-db directly on purpose: the re-export in
 * `@iobroker/js-controller-common` goes through a subpath that does not resolve under this package's
 * `moduleResolution: "node"`.
 *
 * This is a **type-only** reference - it is erased at compile time and does NOT add a runtime dependency
 * on js-controller (which is still resolved dynamically in `resolveControllerTools()` below).
 */
type ControllerTools = typeof ControllerToolsNamespace;

export let controllerCommonModulesInternal: any;

function resolveControllerTools(): ControllerTools {
    // Attempt 1: Resolve @iobroker/js-controller-common from here - JS-Controller 4.1+
    let importPath = tryResolvePackage(['@iobroker/js-controller-common']);
    if (importPath) {
        try {
            controllerCommonModulesInternal = require(importPath);
            const { tools } = controllerCommonModulesInternal;
            if (tools) {
                return tools;
            }
        } catch {
            // did not work, continue
        }
    }

    // Attempt 2: Resolve @iobroker/js-controller-common in JS-Controller dir - JS-Controller 4.1+
    importPath = tryResolvePackage(['@iobroker/js-controller-common'], [join(utils.controllerDir, 'node_modules')]);
    if (importPath) {
        try {
            controllerCommonModulesInternal = require(importPath);
            const { tools } = controllerCommonModulesInternal;
            if (tools) {
                return tools;
            }
        } catch {
            // did not work, continue
        }
    }

    // Attempt 3: Legacy resolve - until JS-Controller 4.0
    importPath = join(utils.controllerDir, 'lib');
    try {
        // This was a default export prior to the TS migration
        const tools = require(join(importPath, 'tools'));
        if (tools) {
            return tools;
        }
    } catch {
        // did not work, continue
    }

    throw new Error('Cannot resolve tools module');
    //return process.exit(10);
}

/** The collection of utility functions in JS-Controller, formerly `lib/tools.js` */
export const controllerToolsInternal = resolveControllerTools();

// Export a subset of the utilities in controllerTools

/**
 * Resolve a module that is either exported by \@iobroker/js-controller-common (new controllers) or located in the controller's `lib` directory (old controllers).
 *
 * Since the resolved shape depends on `name` (e.g. `password`, `session`, `zipFiles`, `exitCodes`),
 * this is generic: callers may specify the expected type, otherwise it defaults to `any` for backwards
 * compatibility. Example: `resolveNamedModule<typeof import('...').password>('password')`.
 *
 * @template T - The expected type of the resolved module. Defaults to `any`.
 * @param name - The filename of the module to resolve
 * @param exportName - The name under which the module may be exported. Defaults to `name`.
 * @returns The resolved module, typed as `T`
 */
export function resolveNamedModule<T = any>(
    name: 'exitCodes' | 'password' | 'session' | 'zipFiles',
    exportName: string = name,
): T {
    // The requested module might be moved to @iobroker/js-controller-common and exported from there
    if (controllerCommonModulesInternal?.[exportName]) {
        return controllerCommonModulesInternal[exportName];
    }

    // Otherwise it was not moved yet, or we're dealing with JS-Controller <= 4.0

    const importPaths = [
        // Attempt 1: JS-Controller 6+
        join(utils.controllerDir, 'build/cjs/lib', name),
        // Attempt 2: JS-Controller 4.1+
        join(utils.controllerDir, 'build/lib', name),
        // Attempt 3: JS-Controller <= 4.0
        join(utils.controllerDir, 'lib', name),
    ];

    for (const importPath of importPaths) {
        try {
            // This was a default export prior to the TS migration
            const module = require(importPath);
            if (module) {
                return module;
            }
        } catch {
            // did not work, continue
        }
    }
    throw new Error(`Cannot resolve JS-Controller module ${name}.js`);
    //return process.exit(10);
}
// TODO: Import types from @iobroker/js-controller-common and iobroker.js-controller

// `pattern2RegEx`, `isLocalAddress` and `isListenAllAddress` are pure functions that do not need
// js-controller. They live in `./tools.js` and are re-exported here (and via `commonTools`) unchanged.

/**
 * Finds the adapter directory of a given adapter
 *
 * @param adapter name of the adapter, e.g., `hm-rpc`
 * @returns path to adapter directory or null if no directory found
 */
function getAdapterDir(adapter: string): string | null {
    return controllerToolsInternal.getAdapterDir(adapter);
}

/** Information about Host */
export interface InstalledInfo {
    /** If it is the js-controller */
    controller?: boolean;
    /** Version of adapter */
    version?: string;
    /** Path to adapter icon */
    icon?: string;
    /** Title of adapter */
    title?: string;
    /** I18n title of adapter */
    titleLang?: ioBroker.Translated;
    /** I18n adapter description */
    desc?: ioBroker.Translated;
    /** Supported adapter platform */
    platform?: string;
    /** The keywords */
    keywords?: string[];
    /** Path to ReadMe */
    readme?: string;
    /** Running version of adapter */
    runningVersion?: string;
    /** The license */
    license?: string;
    /** The url of the license */
    licenseUrl?: string;
}
/**
 * Get a list of all installed adapters and controller version on this host
 *
 * @param hostJsControllerVersion Version of the running js-controller, will be included in the returned information if provided
 * @returns object containing information about installed host
 */
function getInstalledInfo(hostJsControllerVersion?: string): Record<string, InstalledInfo> {
    return controllerToolsInternal.getInstalledInfo(hostJsControllerVersion);
}

/**
 * Checks if we are running inside a docker container
 */
function isDocker(): boolean {
    return controllerToolsInternal.isDocker();
}

/**
 * Retrieve the localhost address according to the configured DNS resolution strategy
 */
function getLocalAddress(): '127.0.0.1' | '::1' {
    return controllerToolsInternal.getLocalAddress();
}

/**
 * Get the ip to listen to all addresses according to configured DNS resolution strategy
 */
function getListenAllAddress(): '0.0.0.0' | '::' {
    return controllerToolsInternal.getListenAllAddress();
}

export const commonTools = {
    pattern2RegEx,
    getAdapterDir,
    getInstalledInfo,
    isDocker,
    getLocalAddress,
    getListenAllAddress,
    isLocalAddress,
    isListenAllAddress,
    // TODO: Add more methods from lib/tools.js as needed

    password: resolveNamedModule('password'),
    session: resolveNamedModule('session'),
    zipFiles: resolveNamedModule('zipFiles'),
    // TODO: expose more (internal) controller modules as needed
};
