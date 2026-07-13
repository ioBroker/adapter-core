// Standalone utility functions that do NOT require js-controller to be resolved.
//
// These are extracted 1:1 from js-controller (packages/common-db/src/lib/common/tools.ts)
// so importing this file - or the `@iobroker/adapter-core/tools` subpath - does not trigger
// the js-controller lookup that happens at module load time in `controllerTools.ts`.
//
// Keep this in sync with:
// https://github.com/ioBroker/ioBroker.js-controller/blob/master/packages/common-db/src/lib/common/tools.ts

/** Characters that are forbidden in object IDs */
export const FORBIDDEN_CHARS = /[^._\-/ :!#$%&()+=@^{}|~\p{Ll}\p{Lu}\p{Nd}]+/gu;

/**
 * Checks if a pattern is a valid object ID pattern
 *
 * @param pattern The pattern to check for validity
 */
export function isValidPattern(pattern: string): boolean {
    pattern = pattern.replace(/\*/g, '');

    return !FORBIDDEN_CHARS.test(pattern);
}

/**
 * Converts a pattern to match object IDs into a RegEx string that can be used in `new RegExp(...)`
 *
 * @param pattern The pattern to convert
 * @returns The RegEx string
 */
export function pattern2RegEx(pattern: string): string {
    pattern = (pattern || '').toString();

    if (!isValidPattern(pattern)) {
        throw new Error(`The pattern "${pattern}" is not a valid ID pattern`);
    }

    const startsWithWildcard = pattern[0] === '*';
    const endsWithWildcard = pattern[pattern.length - 1] === '*';

    pattern = pattern.replace(/[-/\\^$+?.()|[\]{}]/g, '\\$&').replace(/\*/g, '.*');

    return (startsWithWildcard ? '' : '^') + pattern + (endsWithWildcard ? '' : '$');
}

/**
 * Checks if given ip address is matching ipv4 or ipv6 localhost
 *
 * @param ip ipv4 or ipv6 address
 */
export function isLocalAddress(ip: string): boolean {
    const localAddresses = ['::1', '127.0.0.1', 'localhost'];

    return localAddresses.includes(ip);
}

/**
 * Checks if given ip address is matching ipv4 or ipv6 "listen all" address
 *
 * @param ip ipv4 or ipv6 address
 */
export function isListenAllAddress(ip: string): boolean {
    return ip === '0.0.0.0' || ip === '::';
}
