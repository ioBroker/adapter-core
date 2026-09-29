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
