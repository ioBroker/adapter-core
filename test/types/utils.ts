import * as utils from "../../src/utils";

const name = "foobar";
const options = {name};

const adapter1 = utils.adapter(name);
const adapter2 = utils.Adapter(name);

const adapter3 = new utils.adapter(name);
const adapter4 = new utils.Adapter(name);

const adapter5 = utils.adapter(options);
const adapter6 = utils.Adapter(options);

const adapter7 = new utils.adapter(options);
const adapter8 = new utils.Adapter(options);
