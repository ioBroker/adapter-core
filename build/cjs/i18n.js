"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var i18n_exports = {};
__export(i18n_exports, {
  init: () => init,
  t: () => t,
  tt: () => tt
});
module.exports = __toCommonJS(i18n_exports);
var import_node_fs = require("node:fs");
var import_node_path = require("node:path");
let language = "en";
let words = null;
async function init(rootDir, langOrAdmin) {
  if (langOrAdmin && typeof langOrAdmin === "object") {
    const adapter = langOrAdmin;
    const systemConfig = await adapter.getForeignObjectAsync("system.config");
    if (systemConfig == null ? void 0 : systemConfig.common.language) {
      language = systemConfig == null ? void 0 : systemConfig.common.language;
    }
  } else if (typeof langOrAdmin === "string") {
    language = langOrAdmin;
  }
  let files;
  if ((0, import_node_fs.existsSync)((0, import_node_path.join)(rootDir, "i18n"))) {
    files = (0, import_node_fs.readdirSync)((0, import_node_path.join)(rootDir, "i18n"));
  } else if ((0, import_node_fs.existsSync)((0, import_node_path.join)(rootDir, "lib/i18n"))) {
    files = (0, import_node_fs.readdirSync)((0, import_node_path.join)(rootDir, "lib/i18n"));
  } else {
    throw new Error("Cannot find i18n directory");
  }
  words = {};
  files.forEach((file) => {
    if (file.endsWith(".json")) {
      const lang = file.split(".")[0];
      const wordsForLanguage = JSON.parse((0, import_node_fs.readFileSync)((0, import_node_path.join)(rootDir, `/i18n/${file}`)).toString("utf8"));
      Object.keys(wordsForLanguage).forEach((key) => {
        if (words) {
          if (!words[key]) {
            words[key] = {};
          }
          words[key][lang] = wordsForLanguage[key];
        }
      });
    }
  });
}
function t(key, ...args) {
  if (!words) {
    throw new Error("i18n not initialized. Please call 'init(adapter)' before");
  }
  if (!words[key]) {
    return key;
  }
  let text = words[key][language] || words[key].en || key;
  if (args.length) {
    for (let i = 0; i < args.length; i++) {
      text = text.replace(
        "%s",
        args[i] === null ? "null" : args[i].toString()
      );
    }
  }
  return text;
}
function tt(key, ...args) {
  if (!words) {
    throw new Error("i18n not initialized. Please call 'init(adapter)' before");
  }
  if (words[key]) {
    if (words[key].en && words[key].en.includes("%s")) {
      const result = {};
      Object.keys(words[key]).forEach((lang) => {
        for (let i = 0; i < args.length; i++) {
          result[lang] = words[key][lang].replace(
            "%s",
            args[i] === null ? "null" : args[i].toString()
          );
        }
      });
      return result;
    }
    return words[key];
  }
  return key;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  init,
  t,
  tt
});
//# sourceMappingURL=i18n.js.map
