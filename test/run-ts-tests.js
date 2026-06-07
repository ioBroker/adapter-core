const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

function collectTypeScriptTests(startDir) {
    const testFiles = [];

    if (!fs.existsSync(startDir)) {
        return testFiles;
    }

    const entries = fs.readdirSync(startDir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(startDir, entry.name);
        if (entry.isDirectory()) {
            testFiles.push(...collectTypeScriptTests(fullPath));
            continue;
        }
        if (entry.isFile() && entry.name.endsWith('.test.ts')) {
            testFiles.push(fullPath);
        }
    }

    return testFiles;
}

const repoRoot = path.join(__dirname, '..');
const testFiles = [
    ...collectTypeScriptTests(path.join(repoRoot, 'src')),
    ...collectTypeScriptTests(path.join(repoRoot, 'test')),
];

if (testFiles.length === 0) {
    console.log('No TypeScript test files found. Skipping test:ts.');
    process.exit(0);
}

const mochaBin = require.resolve('mocha/bin/mocha.js');
const result = spawnSync(process.execPath, [mochaBin, '--config', path.join('test', '.mocharc.json'), ...testFiles], {
    cwd: repoRoot,
    stdio: 'inherit',
});

if (result.error) {
    throw result.error;
}

process.exit(result.status == null ? 1 : result.status);

