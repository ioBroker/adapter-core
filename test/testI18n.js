describe('i18n', function () {
	this.timeout(3000);
	it('translate', function (done) {
		this.timeout(3000);
		const I18n = require('../build/cjs/i18n');
		I18n.init(__dirname, 'de')
			.then(() => {
				if (I18n.translate('Table') !== 'Tisch') {
					throw new Error('Invalid translation');
				}
				const text = I18n.getTranslatedObject('Chair');
				if (Object.keys(text).length !== 11) {
					throw new Error('Invalid object translation');
				}
				if (text.ru !== 'Стул') {
					throw new Error('Invalid object translation of one language');
				}
				done();
			})
	});
});
