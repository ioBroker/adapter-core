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
