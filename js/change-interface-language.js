var changeInterfaceLanguage = function (lang) {
	var $readMore = $('.readMore'),
		currentLanguage;

	if (lang === 'EN') {
		currentLanguage = 'EN';
		$.each($readMore, function(index, value) {
			value.firstChild.innerHTML = 'Read more';
		});

		$('.spacer-left-title').html('choose an expedition');
		$('.spacer-left-summary').html('Enter and discover more of the scientific expeditions and research travels. Read the stories and study the scientific results.');

		$('#introTitleNL').removeClass('active');
		$('#introTitleEN').addClass('active');
		$('#introNL').removeClass('active');
		$('#introEN').addClass('active');

		$('#menuAbout').html('About Expeditie Wikipedia');
		$('#menuAboutApp').html('About this app');
		$('#menuColofon').html('Colophon');
		$('#menuSponsors').html('Sponsors');
		$('#menuContact').html('Contact us');
		$('#menuAcknowledgments').html('Acknowledgments');


	} else {
		currentLanguage = 'NL';

		$.each($readMore, function(index, value) {
			value.firstChild.innerHTML = 'Lees meer';
		});

		$('.spacer-left-title').html('kies een reis');
		$('.spacer-left-summary').html('stap in en doe mee met de interessante expedities en ontdek alles over geschiedenis en techniek en leer wat wetenschap zo rijk maakt!');

		$('#introTitleNL').addClass('active');
		$('#introTitleEN').removeClass('active');
		$('#introEN').removeClass('active');
		$('#introNL').addClass('active');

		$('#menuAbout').html('Over Expeditie Wikipedia');
		$('#menuAboutApp').html('Over deze app');
		$('#menuColofon').html('Colofon');
		$('#menuSponsors').html('Sponsoren');
		$('#menuContact').html('Contact'); 
		$('#menuAcknowledgments').html('Met dank aan');
	}

	return currentLanguage;
};

module.exports = changeInterfaceLanguage;