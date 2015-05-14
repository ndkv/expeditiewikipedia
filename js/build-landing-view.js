var wikiUtils = require('./wiki-utils');

var buildLandingView = function(expeditions, currentExpedition, menuClickHandler) {
	mode = "landing";
	var $previewListContent = $('<div id="previewListContent"></div>'),
		previewItems = [];

	var width = (expeditions.length * 195) + 4*20;
	$previewListContent.width(width);
	//previewListContent.appendTo(previewList);

	$.each(expeditions, function(index, value) {
		var $expeditionItem = $('<div class="expeditionItem"></div>');
		previewItems.push($expeditionItem);

		var $expeditionContent = $('<div></div>');
		$expeditionContent.appendTo($expeditionItem);

		var $expeditionTitle = $('<div class="expeditionPreviewTitle"></div>');
		$expeditionTitle.html(value.title + " (" + value.language + ")");
		$expeditionTitle.appendTo($expeditionContent);

		//hack, fix
		$expeditionTitle.css('padding-bottom', '40px');

		//tweetaligheid
		var $readMore = $('<div class="readMore"><span>Lees meer</span></div>');
		// $readMore.appendTo($expeditionItem);

		var $container = $('<div class="expeditionItemContainer"></div>');
		$container.append($expeditionItem);
		$container.append($readMore);
		

		// TODO: define as callback in interface-controller.js
		$readMore.click(function () { menuClickHandler(index); });

		// $('.swiper-slide').width(width);
		// $expeditionItem.appendTo($('.swiper-slide'));
		$('#previewSwiper .swiper-slide').width(width);
		// $expeditionItem.appendTo($('#previewSwiper .swiper-slide'));
		$container.appendTo($('#previewSwiper .swiper-slide'));

		if (value.image !== "") {
			var imageUrl = wikiUtils.fetchWikiImage(value.image, 100, function(imageUrl) { $expeditionItem.css('background-image', "url('" + imageUrl + "')"); }, currentExpedition);
		}
	});

	return previewItems;
};

module.exports = buildLandingView;