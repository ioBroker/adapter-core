const assert = require('node:assert/strict');

let initPromise;
let I18n;

describe('i18n', function () {
    this.timeout(3000);
    before(function () {
        I18n = require('../build/cjs/i18n');
        initPromise = I18n.init(__dirname, 'de');
    });
    it('translate', function (done) {
        initPromise.then(() => {
            assert.strictEqual(I18n.translate('Table'), 'Tisch');
            done();
        });
    });
    it('getTranslatedObject', function (done) {
        const text = I18n.getTranslatedObject('Chair');
        assert.strictEqual(Object.keys(text).length, 11);
        assert.strictEqual(text.ru, 'Стул');
        done();
    });
});

describe('i18n shared by two adapters (compact mode)', function () {
    this.timeout(3000);
    // js-controller requires every main file of a compact group into one process, so two adapters
    // that resolve the same installed adapter-core share this module and both call init
    const second = require('node:path').join(__dirname, 'second-adapter');
    const fakeAdapter = warnings => ({
        getForeignObjectAsync: () => Promise.resolve({ common: { language: 'de' } }),
        log: { warn: text => warnings.push(text) },
    });

    // first in this block: the warning is reported once per pair of directories in a process
    it('warns once when a second adapter translates a key differently', async function () {
        const warnings = [];
        await I18n.init(__dirname, fakeAdapter(warnings));
        await I18n.init(second, fakeAdapter(warnings));
        await I18n.init(second, fakeAdapter(warnings));
        assert.strictEqual(warnings.length, 1, warnings.join('\n'));
        assert.ok(warnings[0].includes('"Table"'), warnings[0]);
        assert.ok(warnings[0].includes('second-adapter'), warnings[0]);
    });

    it('gives every adapter a translator that keeps its own words, also for the same key', async function () {
        const first = await I18n.init(__dirname, 'de');
        const other = await I18n.init(second, 'de');
        assert.strictEqual(first.translate('Table'), 'Tisch');
        assert.strictEqual(first.t('Table'), 'Tisch');
        assert.strictEqual(other.translate('Table'), 'Tafel');
        assert.strictEqual(first.translate('Lamp'), 'Lamp');
        assert.strictEqual(other.translate('Lamp'), 'Lampe');
        assert.strictEqual(first.getTranslatedObject('Chair').ru, 'Стул');
        assert.strictEqual(other.getTranslatedObject('Table').de, 'Tafel');
        assert.deepStrictEqual(other.getTranslatedObject('Chair'), { en: 'Chair' });
    });

    it('keeps the words of the first init at module level and adds the second', async function () {
        await I18n.init(__dirname, 'de');
        await I18n.init(second, 'de');
        assert.strictEqual(I18n.getTranslatedObject('Chair').ru, 'Стул');
        assert.strictEqual(I18n.translate('Lamp'), 'Lampe');
    });
});
