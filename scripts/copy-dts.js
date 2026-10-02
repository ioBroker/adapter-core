/**
 * Copy the emitted type declarations from the ESM build next to the CJS output.
 *
 * `tsc` emits the `.d.ts` files only once (into `build/esm`), but the `require`
 * side of every entry in `exports` points at `build/cjs/*.d.ts`, so the same
 * declarations have to exist there as well.
 *
 * This replaces `cpy-cli`, whose bundled argument parser throws on Node 18
 * while this package supports Node 18 (see `engines`).
 */
const { copyFileSync, mkdirSync, readdirSync } = require('node:fs');
const { dirname, join, relative } = require('node:path');

const from = join(__dirname, '..', 'build', 'esm');
const to = join(__dirname, '..', 'build', 'cjs');

let copied = 0;

/**
 * Copy every `.d.ts` file below one directory, keeping the directory structure
 *
 * @param {string} dir The directory to read
 */
function copyDeclarations(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const source = join(dir, entry.name);
        if (entry.isDirectory()) {
            copyDeclarations(source);
        } else if (entry.name.endsWith('.d.ts')) {
            const target = join(to, relative(from, source));
            mkdirSync(dirname(target), { recursive: true });
            copyFileSync(source, target);
            copied++;
        }
    }
}

copyDeclarations(from);

if (!copied) {
    throw new Error(`No declaration files found in "${from}"`);
}

console.log(`Copied ${copied} declaration files to build/cjs`);
