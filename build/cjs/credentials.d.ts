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
export declare const CREDENTIALS_PREFIX = "system.credentials.";
/** Current version of the credential data format */
export declare const CREDENTIALS_VERSION = 1;
/** Keys in `native` that are reserved for metadata and are not credential fields */
export declare const CREDENTIAL_META_FIELDS: string[];
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
export declare const CREDENTIAL_FORMS: Record<CredentialForm, CredentialFieldDefinition[]>;
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
export declare function getCredentialForm(values: Record<string, any>): CredentialForm;
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
/**
 * Reads one credential and decrypts all encrypted fields with the system secret.
 *
 * @param adapter The adapter instance
 * @param id The credential ID, e.g. `system.credentials.anthropic` (usually taken from the
 *           instance configuration where the user selected it via the `credential` JsonConfig component)
 */
export declare function getCredentials<T extends Record<string, any> = CustomCredentials>(adapter: ioBroker.Adapter, id: string): Promise<CredentialInfo<T>>;
/**
 * Lists all stored credentials (without decrypting any secrets).
 *
 * @param adapter The adapter instance
 * @param type Optional: only list credentials of this type, e.g. 'ai'
 */
export declare function listCredentials(adapter: ioBroker.Adapter, type?: CredentialType | (string & {})): Promise<CredentialListEntry[]>;
/**
 * Subscribes to changes of one credential, so the adapter can e.g. reconnect
 * when the user edits the credential in the admin UI.
 *
 * @param adapter The adapter instance
 * @param id The credential ID, e.g. `system.credentials.anthropic`
 * @param handler Called with the decrypted credential on every change, or with `null` if the credential was deleted
 * @returns A function that unsubscribes again
 */
export declare function subscribeCredentials<T extends Record<string, any> = CustomCredentials>(adapter: ioBroker.Adapter, id: string, handler: (id: string, credentials: CredentialInfo<T> | null) => void): Promise<() => Promise<void>>;
