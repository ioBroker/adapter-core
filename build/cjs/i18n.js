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
var i18n_exports = {};
__export(i18n_exports, {
  default: () => i18n_default,
  getTranslatedObject: () => getTranslatedObject,
  init: () => init,
  t: () => t,
  translate: () => translate
});
module.exports = __toCommonJS(i18n_exports);
var import_node_fs = require("node:fs");
var import_node_path = require("node:path");
let language = "en";
let words = null;
const keySource = /* @__PURE__ */ new Map();
const reportedCollisions = /* @__PURE__ */ new Set();
function readWords(rootDir, adapter) {
  let files;
  if ((0, import_node_fs.existsSync)((0, import_node_path.join)(rootDir, "i18n"))) {
    files = (0, import_node_fs.readdirSync)((0, import_node_path.join)(rootDir, "i18n"));
  } else if ((0, import_node_fs.existsSync)((0, import_node_path.join)(rootDir, "lib", "i18n"))) {
    rootDir = (0, import_node_path.join)(rootDir, "lib");
    files = (0, import_node_fs.readdirSync)((0, import_node_path.join)(rootDir, "i18n"));
  } else {
    throw new Error(`Cannot find i18n directory in "${(0, import_node_path.join)(rootDir, "i18n")}", "${(0, import_node_path.join)(rootDir, "lib", "i18n")}"`);
  }
  const table = {};
  const add = /* @__PURE__ */ __name((lang, wordsForLanguage) => {
    Object.keys(wordsForLanguage).forEach((key) => {
      if (!table[key]) {
        table[key] = {};
      }
      table[key][lang] = wordsForLanguage[key];
    });
  }, "add");
  let count = 0;
  files.forEach((file) => {
    if (file.endsWith(".json")) {
      count++;
      const lang = file.split(".")[0];
      add(lang, JSON.parse((0, import_node_fs.readFileSync)((0, import_node_path.join)(rootDir, "i18n", file)).toString("utf8")));
    }
  });
  if (!count) {
    files.forEach((file) => {
      if ((file.match(/^[a-z]{2}$/) || file === "zh-cn") && (0, import_node_fs.statSync)((0, import_node_path.join)(rootDir, "i18n", file)).isDirectory()) {
        if (adapter) {
          adapter.log.warn("Looks like you use old structure of i18n. Please switch to 1i8n/lang.json instead of i18n/lang/translation.json");
        }
        const lang = file;
        if ((0, import_node_fs.existsSync)((0, import_node_path.join)(rootDir, "i18n", lang, "translations.json"))) {
          add(lang, JSON.parse((0, import_node_fs.readFileSync)((0, import_node_path.join)(rootDir, "i18n", lang, "translations.json")).toString("utf8")));
        }
      }
    });
  }
  return { table, dir: (0, import_node_path.join)(rootDir, "i18n") };
}
__name(readWords, "readWords");
function translateFrom(table, lang, key, args) {
  let text;
  if (!table[key]) {
    text = key;
  } else {
    text = table[key][lang] || table[key].en || key;
  }
  if (args.length) {
    for (const arg of args) {
      text = text.replace("%s", arg === null ? "null" : arg.toString());
    }
  }
  return text;
}
__name(translateFrom, "translateFrom");
function translatedObjectFrom(table, key, args) {
  if (table[key]) {
    const word = table[key];
    if (word.en && word.en.includes("%s")) {
      const result = {};
      Object.keys(word).forEach((lang) => {
        for (const arg of args) {
          result[lang] = word[lang].replace("%s", arg === null ? "null" : arg.toString());
        }
      });
      return result;
    }
    return table[key];
  }
  return {
    en: key
  };
}
__name(translatedObjectFrom, "translatedObjectFrom");
async function init(rootDir, languageOrAdapter) {
  let adapter;
  let ownLanguage = "en";
  if (languageOrAdapter && typeof languageOrAdapter === "object") {
    adapter = languageOrAdapter;
    const systemConfig = await adapter.getForeignObjectAsync("system.config");
    if (systemConfig?.common.language) {
      ownLanguage = systemConfig?.common.language;
    }
  } else {
    ownLanguage = languageOrAdapter;
  }
  language = ownLanguage;
  const { table, dir } = readWords(rootDir, adapter);
  if (!words) {
    words = {};
  }
  for (const key of Object.keys(table)) {
    const before = keySource.get(key);
    if (before && before !== dir && JSON.stringify(words[key]) !== JSON.stringify(table[key])) {
      const pair = `${before}
${dir}`;
      if (!reportedCollisions.has(pair)) {
        reportedCollisions.add(pair);
        const text = `I18n: "${key}" is translated differently in ${before} and ${dir}; the module-level translate answers with the last init \u2014 use the translator returned by init to keep the words of each adapter`;
        if (adapter) {
          adapter.log.warn(text);
        } else {
          console.warn(text);
        }
      }
    }
    if (!before) {
      keySource.set(key, dir);
    }
    words[key] = table[key];
  }
  const translate2 = /* @__PURE__ */ __name((key, ...args) => translateFrom(table, ownLanguage, key, args), "translate");
  return {
    translate: translate2,
    t: translate2,
    getTranslatedObject: /* @__PURE__ */ __name((key, ...args) => translatedObjectFrom(table, key, args), "getTranslatedObject")
  };
}
__name(init, "init");
function translate(key, ...args) {
  if (!words) {
    throw new Error("i18n not initialized. Please call 'init(__dirname, adapter)' before");
  }
  return translateFrom(words, language, key, args);
}
__name(translate, "translate");
const t = translate;
function getTranslatedObject(key, ...args) {
  if (!words) {
    throw new Error("i18n not initialized. Please call 'init(__dirname, adapter)' before");
  }
  return translatedObjectFrom(words, key, args);
}
__name(getTranslatedObject, "getTranslatedObject");
var i18n_default = {
  init,
  translate,
  getTranslatedObject,
  t
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getTranslatedObject,
  init,
  t,
  translate
});
//# sourceMappingURL=i18n.js.map
