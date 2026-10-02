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
    it('translate fills every placeholder in order', function () {
        assert.strictEqual(I18n.translate('Text %s and %s', 'A', 'B'), 'Text A und B');
    });
    it('getTranslatedObject fills every placeholder in order, in every language', function () {
        const text = I18n.getTranslatedObject('Text %s and %s', 'A', 'B');
        assert.deepStrictEqual(text, { en: 'Text A and B', de: 'Text A und B' });
    });
    it('getTranslatedObject without arguments keeps the placeholders', function () {
        const text = I18n.getTranslatedObject('Text %s and %s');
        assert.deepStrictEqual(text, { en: 'Text %s and %s', de: 'Text %s und %s' });
    });
    it('getTranslatedObject fills the placeholders of an unknown key', function () {
        assert.deepStrictEqual(I18n.getTranslatedObject('Unknown %s', 'A'), { en: 'Unknown A' });
    });
    it('a value is inserted as it is, even one that looks like a replacement pattern', function () {
        assert.strictEqual(I18n.translate('Text %s and %s', '$&', "$'"), "Text $& und $'");
        assert.deepStrictEqual(I18n.getTranslatedObject('Text %s and %s', '$1', '$`'), {
            en: 'Text $1 and $`',
            de: 'Text $1 und $`',
        });
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
