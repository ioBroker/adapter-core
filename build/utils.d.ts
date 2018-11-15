export declare const controllerDir: string;
export declare function getConfig(): {};
interface AdapterConstructor {
    (adapterName: string): ioBroker.Adapter;
    (adapterOptions: ioBroker.AdapterOptions): ioBroker.Adapter;
}
export declare const adapter: AdapterConstructor;
export {};
