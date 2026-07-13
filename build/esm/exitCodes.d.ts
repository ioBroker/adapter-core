export type ExitCodes = Readonly<{
    /** Exit without error */
    NO_ERROR: number;
    /** Exit because js-controller is stopped */
    JS_CONTROLLER_STOPPED: number;
    /** Exit because Adapter config is invalid */
    INVALID_ADAPTER_CONFIG: number;
    /** Exit because no adapter config was found */
    NO_ADAPTER_CONFIG_FOUND: number;
    /** Exit because the config is invalid */
    INVALID_CONFIG_OBJECT: number;
    /** Exit because the adapter id is invalid */
    INVALID_ADAPTER_ID: number;
    /** Exit because an uncaught exception occurred */
    UNCAUGHT_EXCEPTION: number;
    /** Exit because the adapter is already running */
    ADAPTER_ALREADY_RUNNING: number;
    /** Exit because instance is disabled */
    INSTANCE_IS_DISABLED: number;
    /** Exit because directory cannot be compressed */
    CANNOT_GZIP_DIRECTORY: number;
    /** Exit because adapter directory could not be found */
    CANNOT_FIND_ADAPTER_DIR: number;
    /** Exit because adapter requested it */
    ADAPTER_REQUESTED_TERMINATION: number;
    /** Exit because the packet name is not known */
    UNKNOWN_PACKET_NAME: number;
    /** Exit because the adapters requested a rebuild */
    ADAPTER_REQUESTED_REBUILD: number;
    /** Exit because instances could not be read */
    CANNOT_READ_INSTANCES: number;
    /** Exit because only one instance is allowed globally */
    NO_MULTIPLE_INSTANCES_ALLOWED: number;
    /** Exit because only one instance is allowed on this host */
    NO_MULTIPLE_INSTANCES_ALLOWED_ON_HOST: number;
    /** Exit because no connection to objects database could be established */
    NO_CONNECTION_TO_OBJ_DB: number;
    /** Exit because no connection to states database could be established */
    NO_CONNECTION_TO_STATES_DB: number;
    /** Exit because the instance already exists */
    INSTANCE_ALREADY_EXISTS: number;
    /** Exit because the npm package could not be installed */
    CANNOT_INSTALL_NPM_PACKET: number;
    /** Exit because the zip could not be extracted */
    CANNOT_EXTRACT_FROM_ZIP: number;
    /** Exit because the io-package.json is invalid */
    INVALID_IO_PACKAGE_JSON: number;
    /** Exit because directory could not be copied */
    CANNOT_COPY_DIR: number;
    /** Exit because adapter files are missing */
    MISSING_ADAPTER_FILES: number;
    /** Exit because the npm version is invalid */
    INVALID_NPM_VERSION: number;
    /** Exit because the node version is invalid */
    INVALID_NODE_VERSION: number;
    /** Exit because the operating system is invalid */
    INVALID_OS: number;
    /** Exit because the dependency version is invalid */
    INVALID_DEPENDENCY_VERSION: number;
    /** Exit because the passed arguments are invalid */
    INVALID_ARGUMENTS: number;
    /** Exit because the password is invalid */
    INVALID_PASSWORD: number;
    /** Exit because the iobroker.json is missing */
    MISSING_CONFIG_JSON: number;
    /** Exit because a non-deletable object cannot be deleted */
    CANNOT_DELETE_NON_DELETABLE: number;
    /** Exit because states could not be retrieved */
    CANNOT_GET_STATES: number;
    /** Exit because repository list could not be retrieved */
    CANNOT_GET_REPO_LIST: number;
    /** Exit because direct restart is requested after stop */
    START_IMMEDIATELY_AFTER_STOP: number;
}>;
/**
 * The exit codes as defined by js-controller, embedded here so they can be used without resolving
 * js-controller (e.g. in browser builds or the admin UI). Import via `@iobroker/adapter-core/exitCodes`.
 *
 * Keep in sync with:
 * https://github.com/ioBroker/ioBroker.js-controller/blob/master/packages/common-db/src/lib/common/exitCodes.ts
 */
export declare const EXIT_CODES: {
    readonly NO_ERROR: 0;
    readonly JS_CONTROLLER_STOPPED: 1;
    readonly INVALID_ADAPTER_CONFIG: 2;
    readonly NO_ADAPTER_CONFIG_FOUND: 3;
    readonly INVALID_CONFIG_OBJECT: 4;
    readonly INVALID_ADAPTER_ID: 5;
    readonly UNCAUGHT_EXCEPTION: 6;
    readonly ADAPTER_ALREADY_RUNNING: 7;
    readonly INSTANCE_IS_DISABLED: 8;
    readonly CANNOT_GZIP_DIRECTORY: 9;
    readonly CANNOT_FIND_ADAPTER_DIR: 10;
    readonly ADAPTER_REQUESTED_TERMINATION: 11;
    readonly UNKNOWN_PACKET_NAME: 12;
    readonly ADAPTER_REQUESTED_REBUILD: 13;
    readonly CANNOT_CREATE_USER_OR_GROUP: 14;
    readonly UNKNOWN_ERROR: 15;
    readonly NON_EXISTING_HOST: 16;
    readonly CANNOT_READ_INSTANCES: 18;
    readonly NO_MULTIPLE_INSTANCES_ALLOWED: 19;
    readonly CANNOT_GET_HOST_INFO: 20;
    readonly NO_MULTIPLE_INSTANCES_ALLOWED_ON_HOST: 21;
    readonly NO_CONNECTION_TO_OBJ_DB: 22;
    readonly NO_CONNECTION_TO_STATES_DB: 23;
    readonly INSTANCE_ALREADY_EXISTS: 24;
    readonly CANNOT_INSTALL_NPM_PACKET: 25;
    readonly CANNOT_EXTRACT_FROM_ZIP: 26;
    readonly INVALID_IO_PACKAGE_JSON: 27;
    readonly CANNOT_COPY_DIR: 28;
    readonly MISSING_ADAPTER_FILES: 29;
    readonly INVALID_NPM_VERSION: 30;
    readonly INVALID_NODE_VERSION: 31;
    readonly INVALID_DEPENDENCY_VERSION: 32;
    readonly INVALID_ARGUMENTS: 33;
    readonly INVALID_PASSWORD: 34;
    readonly INVALID_OS: 35;
    readonly CANNOT_SYNC_FILES: 36;
    readonly CANNOT_ENABLE_MULTIHOST: 37;
    readonly MISSING_CONFIG_JSON: 40;
    readonly CANNOT_DELETE_NON_DELETABLE: 41;
    readonly CANNOT_UPLOAD_DATA: 42;
    readonly CANNOT_SET_OBJECT: 43;
    readonly CANNOT_UPDATE_VENDOR: 44;
    readonly INVALID_REPO: 45;
    readonly CANNOT_UPDATE_LICENSE: 46;
    readonly CANNOT_DELETE_DEPENDENCY: 47;
    readonly CANNOT_GET_STATES: 50;
    readonly ADAPTER_ALREADY_INSTALLED: 51;
    readonly CANNOT_RESTORE_BACKUP: 52;
    readonly ADAPTER_NOT_FOUND: 53;
    readonly MIGRATION_ERROR: 78;
    readonly CONTROLLER_RUNNING: 99;
    readonly CONTROLLER_NOT_RUNNING: 100;
    readonly CANNOT_GET_UUID: 101;
    readonly CANNOT_GET_REPO_LIST: 102;
    readonly START_IMMEDIATELY_AFTER_STOP: 156;
    readonly FILE_NOT_FOUND: 404;
};
