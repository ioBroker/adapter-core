/*
 * `@iobroker/types` has no exports - it only carries `declare global { namespace ioBroker { ... } }`.
 * Adapters get that global namespace through adapter-core's declaration file, and a side-effect
 * import is the only import form TypeScript preserves in declaration emit.
 *
 * Writing that import in `src/index.ts` would also emit a real `require('@iobroker/types')` into the
 * built module, which fails whenever the peer dependency is not installed (`--omit=peer`,
 * `legacy-peer-deps=true`). So the source uses a type-only import, which the compiler erases
 * completely, and the one line that adapters actually need is added back here.
 *
 * Must run before the `cpy` step of `postbuild`, which propagates the declaration to `build/cjs/`.
 * `test/testBuildOutput.js` guards that this stays in place.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const FILE = 'build/esm/index.d.ts';
const LINE = "import '@iobroker/types';";

const content = readFileSync(FILE, 'utf8');

if (content.includes(LINE)) {
    console.log(`${FILE} already imports @iobroker/types, nothing to do`);
} else {
    writeFileSync(FILE, `${LINE}\n${content}`);
    console.log(`Added "${LINE}" to ${FILE}`);
}
