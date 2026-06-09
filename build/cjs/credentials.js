"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var credentials_exports = {};
__export(credentials_exports, {
  CREDENTIALS_PREFIX: () => CREDENTIALS_PREFIX,
  CREDENTIALS_VERSION: () => CREDENTIALS_VERSION,
  CREDENTIAL_FORMS: () => CREDENTIAL_FORMS,
  CREDENTIAL_META_FIELDS: () => CREDENTIAL_META_FIELDS,
  getCredentialForm: () => getCredentialForm,
  getCredentials: () => getCredentials,
  listCredentials: () => listCredentials,
  subscribeCredentials: () => subscribeCredentials
});
module.exports = __toCommonJS(credentials_exports);
const CREDENTIALS_PREFIX = "system.credentials.";
const CREDENTIALS_VERSION = 1;
const CREDENTIAL_META_FIELDS = ["type", "version", "encryptedFields"];
const CREDENTIAL_FORMS = {
  login: [
    { name: "login", type: "text", required: true },
    { name: "password", type: "password", encrypted: true, required: true }
  ],
  key: [{ name: "key", type: "password", encrypted: true, required: true }]
};
function getCredentialForm(values) {
  return values.key !== void 0 ? "key" : "login";
}
__name(getCredentialForm, "getCredentialForm");
function getText(text, lang) {
  if (!text) {
    return "";
  }
  if (typeof text === "string") {
    return text;
  }
  return text[lang || "en"] || text.en || Object.values(text)[0] || "";
}
__name(getText, "getText");
function decodeCredentialObject(adapter, obj) {
  const native = obj.native || {};
  const encryptedFields = Array.isArray(native.encryptedFields) ? native.encryptedFields : [];
  const values = {};
  for (const [key, value] of Object.entries(native)) {
    if (CREDENTIAL_META_FIELDS.includes(key)) {
      continue;
    }
    values[key] = encryptedFields.includes(key) && typeof value === "string" && value ? adapter.decrypt(value) : value;
  }
  return {
    id: obj._id,
    name: getText(obj.common?.name),
    type: native.type || "",
    values
  };
}
__name(decodeCredentialObject, "decodeCredentialObject");
async function getCredentials(adapter, id) {
  if (!id || !id.startsWith(CREDENTIALS_PREFIX)) {
    throw new Error(`Invalid credential ID "${id}": must start with "${CREDENTIALS_PREFIX}"`);
  }
  const obj = await adapter.getForeignObjectAsync(id);
  if (!obj) {
    throw new Error(`Credentials "${id}" not found. Maybe they were deleted in the admin UI.`);
  }
  return decodeCredentialObject(adapter, obj);
}
__name(getCredentials, "getCredentials");
async function listCredentials(adapter, type) {
  const objs = await adapter.getForeignObjectsAsync(`${CREDENTIALS_PREFIX}*`, "config");
  return Object.values(objs).filter((obj) => !!obj && (!type || obj.native?.type === type)).map((obj) => {
    const native = obj.native || {};
    return {
      id: obj._id,
      name: getText(obj.common?.name),
      type: native.type || ""
    };
  });
}
__name(listCredentials, "listCredentials");
async function subscribeCredentials(adapter, id, handler) {
  if (!id || !id.startsWith(CREDENTIALS_PREFIX)) {
    throw new Error(`Invalid credential ID "${id}": must start with "${CREDENTIALS_PREFIX}"`);
  }
  const listener = /* @__PURE__ */ __name((changedId, obj) => {
    if (changedId === id) {
      handler(id, obj ? decodeCredentialObject(adapter, obj) : null);
    }
  }, "listener");
  adapter.on("objectChange", listener);
  await adapter.subscribeForeignObjectsAsync(id);
  return async () => {
    adapter.removeListener("objectChange", listener);
    await adapter.unsubscribeForeignObjectsAsync(id);
  };
}
__name(subscribeCredentials, "subscribeCredentials");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CREDENTIALS_PREFIX,
  CREDENTIALS_VERSION,
  CREDENTIAL_FORMS,
  CREDENTIAL_META_FIELDS,
  getCredentialForm,
  getCredentials,
  listCredentials,
  subscribeCredentials
});
//# sourceMappingURL=credentials.js.map
