// ESM variant of the `#require` helper: recreates `require` and `__dirname` via `import.meta.url`.
import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const require = createRequire(import.meta.url);
export const dirName = dirname(fileURLToPath(import.meta.url));
