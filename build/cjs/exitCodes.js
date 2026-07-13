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
var exitCodes_exports = {};
__export(exitCodes_exports, {
  EXIT_CODES: () => EXIT_CODES
});
module.exports = __toCommonJS(exitCodes_exports);
const EXIT_CODES = {
  NO_ERROR: 0,
  JS_CONTROLLER_STOPPED: 1,
  INVALID_ADAPTER_CONFIG: 2,
  NO_ADAPTER_CONFIG_FOUND: 3,
  INVALID_CONFIG_OBJECT: 4,
  INVALID_ADAPTER_ID: 5,
  UNCAUGHT_EXCEPTION: 6,
  ADAPTER_ALREADY_RUNNING: 7,
  INSTANCE_IS_DISABLED: 8,
  CANNOT_GZIP_DIRECTORY: 9,
  CANNOT_FIND_ADAPTER_DIR: 10,
  ADAPTER_REQUESTED_TERMINATION: 11,
  UNKNOWN_PACKET_NAME: 12,
  ADAPTER_REQUESTED_REBUILD: 13,
  CANNOT_CREATE_USER_OR_GROUP: 14,
  UNKNOWN_ERROR: 15,
  NON_EXISTING_HOST: 16,
  CANNOT_READ_INSTANCES: 18,
  NO_MULTIPLE_INSTANCES_ALLOWED: 19,
  CANNOT_GET_HOST_INFO: 20,
  NO_MULTIPLE_INSTANCES_ALLOWED_ON_HOST: 21,
  NO_CONNECTION_TO_OBJ_DB: 22,
  NO_CONNECTION_TO_STATES_DB: 23,
  INSTANCE_ALREADY_EXISTS: 24,
  CANNOT_INSTALL_NPM_PACKET: 25,
  CANNOT_EXTRACT_FROM_ZIP: 26,
  INVALID_IO_PACKAGE_JSON: 27,
  CANNOT_COPY_DIR: 28,
  MISSING_ADAPTER_FILES: 29,
  INVALID_NPM_VERSION: 30,
  INVALID_NODE_VERSION: 31,
  INVALID_DEPENDENCY_VERSION: 32,
  INVALID_ARGUMENTS: 33,
  INVALID_PASSWORD: 34,
  INVALID_OS: 35,
  CANNOT_SYNC_FILES: 36,
  CANNOT_ENABLE_MULTIHOST: 37,
  MISSING_CONFIG_JSON: 40,
  CANNOT_DELETE_NON_DELETABLE: 41,
  CANNOT_UPLOAD_DATA: 42,
  CANNOT_SET_OBJECT: 43,
  CANNOT_UPDATE_VENDOR: 44,
  INVALID_REPO: 45,
  CANNOT_UPDATE_LICENSE: 46,
  CANNOT_DELETE_DEPENDENCY: 47,
  CANNOT_GET_STATES: 50,
  ADAPTER_ALREADY_INSTALLED: 51,
  CANNOT_RESTORE_BACKUP: 52,
  ADAPTER_NOT_FOUND: 53,
  MIGRATION_ERROR: 78,
  CONTROLLER_RUNNING: 99,
  CONTROLLER_NOT_RUNNING: 100,
  CANNOT_GET_UUID: 101,
  CANNOT_GET_REPO_LIST: 102,
  START_IMMEDIATELY_AFTER_STOP: 156,
  FILE_NOT_FOUND: 404
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EXIT_CODES
});
//# sourceMappingURL=exitCodes.js.map
