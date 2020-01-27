/// <reference types="iobroker" />
/** The root directory of JS-Controller */
export declare const controllerDir: string;
/** Reads the configuration file of JS-Controller */
export declare function getConfig(): Record<string, any>;
/**
 * This type is used to include and exclude the states and objects cache from the adaptert type definition depending on the creation options
 */
export declare type AdapterInstance = Omit<ioBroker.Adapter, "oObjects" | "oStates">;
declare type AdapterInstanceType<T extends ioBroker.AdapterOptions> = T extends {
    objects: true;
    states: true;
} ? AdapterInstance & {
    oObjects: Exclude<ioBroker.Adapter["oObjects"], undefined>;
    oStates: Exclude<ioBroker.Adapter["oStates"], undefined>;
} : T extends {
    objects: true;
} ? AdapterInstance & {
    oObjects: Exclude<ioBroker.Adapter["oObjects"], undefined>;
} : T extends {
    states: true;
} ? AdapterInstance & {
    oStates: Exclude<ioBroker.Adapter["oStates"], undefined>;
} : AdapterInstance;
interface AdapterConstructor {
    new (adapterName: string): AdapterInstance;
    new <T extends ioBroker.AdapterOptions>(adapterOptions: T): AdapterInstanceType<T>;
    (adapterName: string): AdapterInstance;
    <T extends ioBroker.AdapterOptions>(adapterOptions: ioBroker.AdapterOptions): AdapterInstanceType<T>;
}
/** Creates a new adapter instance */
export declare const adapter: AdapterConstructor;
/** Creates a new adapter instance */
export declare const Adapter: AdapterConstructor;
export {};
