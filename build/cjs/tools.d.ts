/** Characters that are forbidden in object IDs */
export declare const FORBIDDEN_CHARS: RegExp;
/**
 * Checks if a pattern is a valid object ID pattern
 *
 * @param pattern The pattern to check for validity
 */
export declare function isValidPattern(pattern: string): boolean;
/**
 * Converts a pattern to match object IDs into a RegEx string that can be used in `new RegExp(...)`
 *
 * @param pattern The pattern to convert
 * @returns The RegEx string
 */
export declare function pattern2RegEx(pattern: string): string;
/**
 * Checks if given ip address is matching ipv4 or ipv6 localhost
 *
 * @param ip ipv4 or ipv6 address
 */
export declare function isLocalAddress(ip: string): boolean;
/**
 * Checks if given ip address is matching ipv4 or ipv6 "listen all" address
 *
 * @param ip ipv4 or ipv6 address
 */
export declare function isListenAllAddress(ip: string): boolean;
