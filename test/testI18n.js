const { expect } = require('chai');

let initPromise;
let I18n;

describe('i18n', function () {
	this.timeout(3000);
	before(function () {
		I18n = require('../build/cjs/i18n');
		initPromise = I18n.init(__dirname, 'de');
	})
	it('translate', function (done) {
		initPromise.then(() => {
			expect(I18n.translate('Table')).to.be.equal('Tisch');
			done();
		})
	});
	it('getTranslatedObject', function (done) {
		const text = I18n.getTranslatedObject('Chair');
		expect(Object.keys(text).length).to.be.equal(11);
		expect(text.ru).to.be.equal('Стул');
		done();
	})
});
