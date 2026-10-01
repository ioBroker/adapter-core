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
    it('keeps the words of the first init when a second adapter initializes', async function () {
        await I18n.init(__dirname, 'de');
        await I18n.init(require('node:path').join(__dirname, 'second-adapter'), 'de');
        assert.strictEqual(I18n.translate('Table'), 'Tisch');
        assert.strictEqual(I18n.getTranslatedObject('Chair').ru, 'Стул');
        assert.strictEqual(I18n.translate('Lamp'), 'Lampe');
    });
});
