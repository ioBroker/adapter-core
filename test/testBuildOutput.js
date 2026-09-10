const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const buildDir = join(__dirname, '..', 'build');
const read = relativePath => readFileSync(join(buildDir, relativePath), 'utf8');

describe('build output', function () {
    // `@iobroker/types` only carries `declare global { namespace ioBroker { ... } }`. Adapters get
    // that namespace through our declaration file, so the side-effect import has to survive there.
    for (const file of ['esm/index.d.ts', 'cjs/index.d.ts']) {
        it(`${file} imports @iobroker/types so adapters see the ioBroker namespace`, function () {
            assert.match(
                read(file),
                /^import '@iobroker\/types';$/m,
                `${file} is missing the @iobroker/types import - see scripts/inject-types-import.mjs`,
            );
        });
    }

    // The same import must not reach the built module: `@iobroker/types` is a peer dependency, so
    // requiring it at runtime breaks installs done with `--omit=peer` or `legacy-peer-deps=true`.
    it('esm/index.js does not import @iobroker/types at runtime', function () {
        assert.doesNotMatch(read('esm/index.js'), /^import\s+.*'@iobroker\/types'/m);
    });

    it('cjs/index.js does not require @iobroker/types at runtime', function () {
        assert.doesNotMatch(read('cjs/index.js'), /require\(["']@iobroker\/types["']\)/);
    });
});
