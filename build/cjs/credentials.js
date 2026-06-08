"use strict";
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
Object.defineProperty(exports, "__esModule", { value: true });
exports.CREDENTIAL_FORMS = exports.CREDENTIAL_META_FIELDS = exports.CREDENTIALS_VERSION = exports.CREDENTIALS_PREFIX = void 0;
exports.getCredentialForm = getCredentialForm;
exports.getCredentials = getCredentials;
exports.listCredentials = listCredentials;
exports.subscribeCredentials = subscribeCredentials;
exports.CREDENTIALS_PREFIX = "system.credentials.";
exports.CREDENTIALS_VERSION = 1;
exports.CREDENTIAL_META_FIELDS = ["type", "version", "encryptedFields"];
exports.CREDENTIAL_FORMS = {
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
    if (exports.CREDENTIAL_META_FIELDS.includes(key)) {
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
  if (!id || !id.startsWith(exports.CREDENTIALS_PREFIX)) {
    throw new Error(`Invalid credential ID "${id}": must start with "${exports.CREDENTIALS_PREFIX}"`);
  }
  const obj = await adapter.getForeignObjectAsync(id);
  if (!obj) {
    throw new Error(`Credentials "${id}" not found. Maybe they were deleted in the admin UI.`);
  }
  return decodeCredentialObject(adapter, obj);
}
__name(getCredentials, "getCredentials");
async function listCredentials(adapter, type) {
  const objs = await adapter.getForeignObjectsAsync(`${exports.CREDENTIALS_PREFIX}*`, "config");
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
  if (!id || !id.startsWith(exports.CREDENTIALS_PREFIX)) {
    throw new Error(`Invalid credential ID "${id}": must start with "${exports.CREDENTIALS_PREFIX}"`);
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
//# sourceMappingURL=credentials.js.map
