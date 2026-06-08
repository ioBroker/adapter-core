"use strict";
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
Object.defineProperty(exports, "__esModule", { value: true });
exports.t = void 0;
exports.init = init;
exports.translate = translate;
exports.getTranslatedObject = getTranslatedObject;
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
let language = "en";
let words = null;
async function init(rootDir, languageOrAdapter) {
  let adapter;
  if (languageOrAdapter && typeof languageOrAdapter === "object") {
    adapter = languageOrAdapter;
    const systemConfig = await adapter.getForeignObjectAsync("system.config");
    if (systemConfig?.common.language) {
      language = systemConfig?.common.language;
    }
  } else {
    language = languageOrAdapter;
  }
  let files;
  if ((0, node_fs_1.existsSync)((0, node_path_1.join)(rootDir, "i18n"))) {
    files = (0, node_fs_1.readdirSync)((0, node_path_1.join)(rootDir, "i18n"));
  } else if ((0, node_fs_1.existsSync)((0, node_path_1.join)(rootDir, "lib", "i18n"))) {
    rootDir = (0, node_path_1.join)(rootDir, "lib");
    files = (0, node_fs_1.readdirSync)((0, node_path_1.join)(rootDir, "i18n"));
  } else {
    throw new Error(`Cannot find i18n directory in "${(0, node_path_1.join)(rootDir, "i18n")}", "${(0, node_path_1.join)(rootDir, "lib", "i18n")}"`);
  }
  words = {};
  let count = 0;
  files.forEach((file) => {
    if (file.endsWith(".json")) {
      count++;
      const lang = file.split(".")[0];
      const wordsForLanguage = JSON.parse((0, node_fs_1.readFileSync)((0, node_path_1.join)(rootDir, "i18n", file)).toString("utf8"));
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
  if (!count) {
    files.forEach((file) => {
      if ((file.match(/^[a-z]{2}$/) || file === "zh-cn") && (0, node_fs_1.statSync)((0, node_path_1.join)(rootDir, "i18n", file)).isDirectory()) {
        if (adapter) {
          adapter.log.warn("Looks like you use old structure of i18n. Please switch to 1i8n/lang.json instead of i18n/lang/translation.json");
        }
        const lang = file;
        if ((0, node_fs_1.existsSync)((0, node_path_1.join)(rootDir, "i18n", lang, "translations.json"))) {
          const wordsForLanguage = JSON.parse((0, node_fs_1.readFileSync)((0, node_path_1.join)(rootDir, "i18n", lang, "translations.json")).toString("utf8"));
          Object.keys(wordsForLanguage).forEach((key) => {
            if (words) {
              if (!words[key]) {
                words[key] = {};
              }
              words[key][lang] = wordsForLanguage[key];
            }
          });
        }
      }
    });
  }
}
__name(init, "init");
function translate(key, ...args) {
  if (!words) {
    throw new Error("i18n not initialized. Please call 'init(__dirname, adapter)' before");
  }
  let text;
  if (!words[key]) {
    text = key;
  } else {
    text = words[key][language] || words[key].en || key;
  }
  if (args.length) {
    for (const arg of args) {
      text = text.replace("%s", arg === null ? "null" : arg.toString());
    }
  }
  return text;
}
__name(translate, "translate");
exports.t = translate;
function getTranslatedObject(key, ...args) {
  if (!words) {
    throw new Error("i18n not initialized. Please call 'init(__dirname, adapter)' before");
  }
  if (words[key]) {
    const word = words[key];
    if (word.en && word.en.includes("%s")) {
      const result = {};
      Object.keys(word).forEach((lang) => {
        for (const arg of args) {
          result[lang] = word[lang].replace("%s", arg === null ? "null" : arg.toString());
        }
      });
      return result;
    }
    return words[key];
  }
  return {
    en: key
  };
}
__name(getTranslatedObject, "getTranslatedObject");
exports.default = {
  init,
  translate,
  getTranslatedObject,
  t: exports.t
};
//# sourceMappingURL=i18n.js.map
