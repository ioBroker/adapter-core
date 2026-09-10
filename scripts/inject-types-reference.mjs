/*
 * `@iobroker/types` has no exports - it only carries `declare global { namespace ioBroker { ... } }`.
 * Adapters get that global namespace through adapter-core's declaration file, so the declaration has
 * to declare a dependency on those types.
 *
 * TypeScript cannot put that line there for us. A side-effect import in `src/index.ts` survives
 * declaration emit, but it also emits a real `require('@iobroker/types')` into the built module,
 * which fails whenever the peer dependency is not installed (`--omit=peer`,
 * `legacy-peer-deps=true`). The forms that leave no runtime trace - `import type {} from ...` and a
 * triple-slash reference in the source - are both dropped from the declaration output, even though
 * `index.d.ts` uses `ioBroker.Adapter` in an exported signature.
 *
 * So the source uses a type-only import, which the compiler erases completely, and the declaration
 * gets a triple-slash reference here. That directive says what is actually meant - this declaration
 * depends on the types of that package - instead of claiming a runtime module import, and it is the
 * documented use for hand-authored declaration files:
 * https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html
 *
 * Must run before the `cpy` step of `postbuild`, which propagates the declaration to `build/cjs/`.
 * `test/testBuildOutput.js` guards that this stays in place.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const FILE = 'build/esm/index.d.ts';
const DIRECTIVE = '/// <reference types="@iobroker/types" />';

const content = readFileSync(FILE, 'utf8');

if (content.includes(DIRECTIVE)) {
    console.log(`${FILE} already references @iobroker/types, nothing to do`);
} else {
    writeFileSync(FILE, `${DIRECTIVE}\n${content}`);
    console.log(`Added "${DIRECTIVE}" to ${FILE}`);
}
