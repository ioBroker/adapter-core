/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/class-name-casing */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as utils from "../../src/utils";

const name = "foobar";
const options = { name };

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
