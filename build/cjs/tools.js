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
var tools_exports = {};
__export(tools_exports, {
  FORBIDDEN_CHARS: () => FORBIDDEN_CHARS,
  isListenAllAddress: () => isListenAllAddress,
  isLocalAddress: () => isLocalAddress,
  isValidPattern: () => isValidPattern,
  pattern2RegEx: () => pattern2RegEx
});
module.exports = __toCommonJS(tools_exports);
const FORBIDDEN_CHARS = /[^._\-/ :!#$%&()+=@^{}|~\p{Ll}\p{Lu}\p{Nd}]+/gu;
function isValidPattern(pattern) {
  pattern = pattern.replace(/\*/g, "");
  return !FORBIDDEN_CHARS.test(pattern);
}
__name(isValidPattern, "isValidPattern");
function pattern2RegEx(pattern) {
  pattern = (pattern || "").toString();
  if (!isValidPattern(pattern)) {
    throw new Error(`The pattern "${pattern}" is not a valid ID pattern`);
  }
  const startsWithWildcard = pattern[0] === "*";
  const endsWithWildcard = pattern[pattern.length - 1] === "*";
  pattern = pattern.replace(/[-/\\^$+?.()|[\]{}]/g, "\\$&").replace(/\*/g, ".*");
  return (startsWithWildcard ? "" : "^") + pattern + (endsWithWildcard ? "" : "$");
}
__name(pattern2RegEx, "pattern2RegEx");
function isLocalAddress(ip) {
  const localAddresses = ["::1", "127.0.0.1", "localhost"];
  return localAddresses.includes(ip);
}
__name(isLocalAddress, "isLocalAddress");
function isListenAllAddress(ip) {
  return ip === "0.0.0.0" || ip === "::";
}
__name(isListenAllAddress, "isListenAllAddress");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FORBIDDEN_CHARS,
  isListenAllAddress,
  isLocalAddress,
  isValidPattern,
  pattern2RegEx
});
//# sourceMappingURL=tools.js.map
