"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CREDENTIAL_FORMS = exports.CREDENTIAL_META_FIELDS = exports.CREDENTIALS_VERSION = exports.CREDENTIALS_PREFIX = void 0;
exports.getCredentialForm = getCredentialForm;
exports.getCredentials = getCredentials;
exports.listCredentials = listCredentials;
exports.subscribeCredentials = subscribeCredentials;
/**
 * Central credential storage for ioBroker.
 *
 * Credentials are stored as objects with IDs like `system.credentials.<name>`,
 * e.g. `system.credentials.anthropic`. The admin adapter provides the UI to manage them
 * (Settings -> Credentials) and a JsonConfig component `credential` so adapters can let
 * the user pick a credential by ID in the instance configuration.
 *
 * All information lives in `native`:
 * - `native.type` - the credential type (email, cloud, ai, custom) - a pure category used for filtering
 * - `native.version` - version of the data format (for future migrations)
 * - `native.encryptedFields` - names of the fields in `native` that are stored encrypted
 *   with the system secret
 * - all other keys in `native` are the credential fields themselves
 *
 * Every credential has one of two forms:
 * - `login`: a `login` and a `password` field (password encrypted)
 * - `key`: a single `key` field (encrypted), e.g. an API key
 *
 * This module is intentionally free of Node.js imports so it can also be consumed by
 * browser builds (admin UI, json-config).
 */
/** Prefix of all credential object IDs */
exports.CREDENTIALS_PREFIX = 'system.credentials.';
/** Current version of the credential data format */
exports.CREDENTIALS_VERSION = 1;
/** Keys in `native` that are reserved for metadata and are not credential fields */
exports.CREDENTIAL_META_FIELDS = ['type', 'version', 'encryptedFields'];
/**
 * Registry of the two credential forms and their fields.
 * This is the single source of truth - the admin UI renders its dialogs from it.
 */
exports.CREDENTIAL_FORMS = {
    login: [
        { name: 'login', type: 'text', required: true },
        { name: 'password', type: 'password', encrypted: true, required: true },
    ],
    key: [{ name: 'key', type: 'password', encrypted: true, required: true }],
};
/**
 * Detects the form of a credential from its fields.
 *
 * @param values The credential fields (e.g. `CredentialInfo.values`)
 */
function getCredentialForm(values) {
    return values.key !== undefined ? 'key' : 'login';
}
function getText(text, lang) {
    if (!text) {
        return '';
    }
    if (typeof text === 'string') {
        return text;
    }
    return text[lang || 'en'] || text.en || Object.values(text)[0] || '';
}
function decodeCredentialObject(adapter, obj) {
    const native = obj.native || {};
    const encryptedFields = Array.isArray(native.encryptedFields) ? native.encryptedFields : [];
    const values = {};
    for (const [key, value] of Object.entries(native)) {
        if (exports.CREDENTIAL_META_FIELDS.includes(key)) {
            continue;
        }
        values[key] =
            encryptedFields.includes(key) && typeof value === 'string' && value ? adapter.decrypt(value) : value;
    }
    return {
        id: obj._id,
        name: getText(obj.common?.name),
        type: native.type || '',
        values: values,
    };
}
/**
 * Reads one credential and decrypts all encrypted fields with the system secret.
 *
 * @param adapter The adapter instance
 * @param id The credential ID, e.g. `system.credentials.anthropic` (usually taken from the
 *           instance configuration where the user selected it via the `credential` JsonConfig component)
 */
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
/**
 * Lists all stored credentials (without decrypting any secrets).
 *
 * @param adapter The adapter instance
 * @param type Optional: only list credentials of this type, e.g. 'ai'
 */
async function listCredentials(adapter, type) {
    const objs = await adapter.getForeignObjectsAsync(`${exports.CREDENTIALS_PREFIX}*`, 'config');
    return Object.values(objs)
        .filter(obj => !!obj && (!type || obj.native?.type === type))
        .map(obj => {
        const native = obj.native || {};
        return {
            id: obj._id,
            name: getText(obj.common?.name),
            type: native.type || '',
        };
    });
}
/**
 * Subscribes to changes of one credential, so the adapter can e.g. reconnect
 * when the user edits the credential in the admin UI.
 *
 * @param adapter The adapter instance
 * @param id The credential ID, e.g. `system.credentials.anthropic`
 * @param handler Called with the decrypted credential on every change, or with `null` if the credential was deleted
 * @returns A function that unsubscribes again
 */
async function subscribeCredentials(adapter, id, handler) {
    if (!id || !id.startsWith(exports.CREDENTIALS_PREFIX)) {
        throw new Error(`Invalid credential ID "${id}": must start with "${exports.CREDENTIALS_PREFIX}"`);
    }
    const listener = (changedId, obj) => {
        if (changedId === id) {
            handler(id, obj ? decodeCredentialObject(adapter, obj) : null);
        }
    };
    adapter.on('objectChange', listener);
    await adapter.subscribeForeignObjectsAsync(id);
    return async () => {
        adapter.removeListener('objectChange', listener);
        await adapter.unsubscribeForeignObjectsAsync(id);
    };
}
