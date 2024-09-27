/* eslint-disable @typescript-eslint/no-unused-vars */
import * as utils from '../../src/index';

const name = 'foobar';
const options = { name, objects: true } as const;

const adapter1 = utils.adapter(name);
const adapter2 = utils.Adapter(name);

const adapter3 = new utils.adapter(name);
const adapter4 = new utils.Adapter(name);

const adapter5 = utils.adapter(options);
const adapter6 = utils.Adapter(options);

const adapter7 = new utils.adapter(options);
const adapter8 = new utils.Adapter({ ...options, objects: true });

class adapter9 extends utils.Adapter<false, true> {
    constructor(options: utils.AdapterOptions) {
        super({ ...options, states: true });
    }
}

class adapter10 extends utils.Adapter<true> {
    constructor(options: utils.AdapterOptions) {
        super({ ...options, objects: true });
    }
}

class adapter11 extends utils.Adapter {
    constructor(options: utils.AdapterOptions) {
        super({ ...options });
    }
}

// default no objects cache
const res1: undefined = adapter1.oObjects;
// if objects given, with cache
const res2: Record<string, ioBroker.Object | undefined> = adapter5.oObjects;

// the created instance is accepted by the utility methods
utils.getAbsoluteInstanceDataDir(adapter1);

const code: number = utils.EXIT_CODES.ADAPTER_REQUESTED_TERMINATION;
