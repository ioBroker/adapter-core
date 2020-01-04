/// <reference types="iobroker" />
export * from "./utils";
/**
 * Returns the absolute path of the data directory for the current host. On linux, this is usually `/opt/iobroker/iobroker-data`.
 */
export declare function getAbsoluteDefaultDataDir(): string;
/**
 * Returns the absolute path of the data directory for the current adapter instance.
 * On linux, this is usually `/opt/iobroker/iobroker-data/<adapterName>.<instanceNr>`
 */
export declare function getAbsoluteInstanceDataDir(adapterObject: ioBroker.Adapter): string;
