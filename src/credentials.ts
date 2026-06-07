import type {} from '@iobroker/types';

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
export const CREDENTIALS_PREFIX = 'system.credentials.';

/** Current version of the credential data format */
export const CREDENTIALS_VERSION = 1;

/** Keys in `native` that are reserved for metadata and are not credential fields */
export const CREDENTIAL_META_FIELDS = ['type', 'version', 'encryptedFields'];

/** Categories of credentials (stored in `native.type`) */
export type CredentialType = 'email' | 'cloud' | 'ai' | 'custom';

/** The two forms a credential can have: login/password or a single key */
export type CredentialForm = 'login' | 'key';

/** Description of one field of a credential form */
export interface CredentialFieldDefinition {
    /** Attribute name in the object's `native` */
    name: string;
    /** How the field should be rendered and validated */
    type: 'text' | 'password';
    /** The field is stored encrypted with the system secret */
    encrypted?: boolean;
    /** The field must be filled */
    required?: boolean;
}

/**
 * Registry of the two credential forms and their fields.
 * This is the single source of truth - the admin UI renders its dialogs from it.
 */
export const CREDENTIAL_FORMS: Record<CredentialForm, CredentialFieldDefinition[]> = {
    login: [
        { name: 'login', type: 'text', required: true },
        { name: 'password', type: 'password', encrypted: true, required: true },
    ],
    key: [{ name: 'key', type: 'password', encrypted: true, required: true }],
};

/** Fields of a credential with the `login` form */
export interface LoginPasswordCredentials {
    /** User name / account / e-mail address */
    login: string;
    /** Password (decrypted) */
    password: string;
}

/** Fields of a credential with the `key` form, e.g. an API key */
export interface KeyCredentials {
    /** The key (decrypted) */
    key: string;
}

/** Fields of any credential */
export type CustomCredentials = Record<string, string | number | boolean>;

/**
 * Detects the form of a credential from its fields.
 *
 * @param values The credential fields (e.g. `CredentialInfo.values`)
 */
export function getCredentialForm(values: Record<string, any>): CredentialForm {
    return values.key !== undefined ? 'key' : 'login';
}

/** A credential with all encrypted fields decrypted */
export interface CredentialInfo<T extends Record<string, any> = CustomCredentials> {
    /** Object ID, e.g. `system.credentials.anthropic` */
    id: string;
    /** Display name from `common.name` */
    name: string;
    /** Credential type, e.g. 'ai' */
    type: CredentialType | (string & {});
    /** The credential fields with all encrypted fields decrypted */
    values: T;
}

/** One entry of the credential list (without any secrets) */
export interface CredentialListEntry {
    /** Object ID, e.g. `system.credentials.anthropic` */
    id: string;
    /** Display name from `common.name` */
    name: string;
    /** Credential type, e.g. 'ai' */
    type: CredentialType | (string & {});
}

function getText(text: ioBroker.StringOrTranslated | undefined, lang?: ioBroker.Languages): string {
    if (!text) {
        return '';
    }
    if (typeof text === 'string') {
        return text;
    }
    return text[lang || 'en'] || text.en || Object.values(text)[0] || '';
}

function decodeCredentialObject<T extends Record<string, any>>(
    adapter: ioBroker.Adapter,
    obj: ioBroker.Object,
): CredentialInfo<T> {
    const native: Record<string, any> = obj.native || {};
    const encryptedFields: string[] = Array.isArray(native.encryptedFields) ? native.encryptedFields : [];
    const values: Record<string, any> = {};

    for (const [key, value] of Object.entries(native)) {
        if (CREDENTIAL_META_FIELDS.includes(key)) {
            continue;
        }
        values[key] =
            encryptedFields.includes(key) && typeof value === 'string' && value ? adapter.decrypt(value) : value;
    }

    return {
        id: obj._id,
        name: getText(obj.common?.name),
        type: native.type || '',
        values: values as T,
    };
}

/**
 * Reads one credential and decrypts all encrypted fields with the system secret.
 *
 * @param adapter The adapter instance
 * @param id The credential ID, e.g. `system.credentials.anthropic` (usually taken from the
 *           instance configuration where the user selected it via the `credential` JsonConfig component)
 */
export async function getCredentials<T extends Record<string, any> = CustomCredentials>(
    adapter: ioBroker.Adapter,
    id: string,
): Promise<CredentialInfo<T>> {
    if (!id || !id.startsWith(CREDENTIALS_PREFIX)) {
        throw new Error(`Invalid credential ID "${id}": must start with "${CREDENTIALS_PREFIX}"`);
    }
    const obj = await adapter.getForeignObjectAsync(id);
    if (!obj) {
        throw new Error(`Credentials "${id}" not found. Maybe they were deleted in the admin UI.`);
    }
    return decodeCredentialObject<T>(adapter, obj);
}

/**
 * Lists all stored credentials (without decrypting any secrets).
 *
 * @param adapter The adapter instance
 * @param type Optional: only list credentials of this type, e.g. 'ai'
 */
export async function listCredentials(
    adapter: ioBroker.Adapter,
    type?: CredentialType | (string & {}),
): Promise<CredentialListEntry[]> {
    const objs = await adapter.getForeignObjectsAsync(`${CREDENTIALS_PREFIX}*`, 'config');
    return Object.values(objs)
        .filter(obj => !!obj && (!type || (obj.native as Record<string, any>)?.type === type))
        .map(obj => {
            const native: Record<string, any> = obj.native || {};
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
export async function subscribeCredentials<T extends Record<string, any> = CustomCredentials>(
    adapter: ioBroker.Adapter,
    id: string,
    handler: (id: string, credentials: CredentialInfo<T> | null) => void,
): Promise<() => Promise<void>> {
    if (!id || !id.startsWith(CREDENTIALS_PREFIX)) {
        throw new Error(`Invalid credential ID "${id}": must start with "${CREDENTIALS_PREFIX}"`);
    }

    const listener: ioBroker.ObjectChangeHandler = (changedId, obj) => {
        if (changedId === id) {
            handler(id, obj ? decodeCredentialObject<T>(adapter, obj) : null);
        }
    };

    adapter.on('objectChange', listener);
    await adapter.subscribeForeignObjectsAsync(id);

    return async () => {
        adapter.removeListener('objectChange', listener);
        await adapter.unsubscribeForeignObjectsAsync(id);
    };
}
