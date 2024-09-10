"use strict";
var import_node_fs = require("node:fs");
var import_node_path = require("node:path");
function convert(rootDir) {
  if ((0, import_node_fs.existsSync)((0, import_node_path.join)(rootDir, "i18n"))) {
    rootDir = (0, import_node_path.join)(rootDir, "i18n");
  } else if ((0, import_node_fs.existsSync)((0, import_node_path.join)(rootDir, "lib", "i18n"))) {
    rootDir = (0, import_node_path.join)(rootDir, "lib", "i18n");
  } else if ((0, import_node_fs.existsSync)((0, import_node_path.join)(rootDir, "admin", "i18n"))) {
    rootDir = (0, import_node_path.join)(rootDir, "admin", "i18n");
  } else if (rootDir.endsWith("i18n")) {
  }
  const langs = (0, import_node_fs.readdirSync)(rootDir);
  for (const lang of langs) {
    if ((lang.match(/^[a-z]{2}$/) || lang === "zh-cn") && (0, import_node_fs.existsSync)((0, import_node_path.join)(rootDir, lang, "translations.json"))) {
      (0, import_node_fs.renameSync)((0, import_node_path.join)(rootDir, lang, "translations.json"), (0, import_node_path.join)(rootDir, `${lang}.json`));
      (0, import_node_fs.unlinkSync)((0, import_node_path.join)(rootDir, lang));
    }
  }
}
if (process.argv.length < 3) {
  console.warn("Usage: node i18nConvert <path>");
  convert(".");
} else {
  convert(process.argv[2]);
}
//# sourceMappingURL=i18nConvert.js.map
