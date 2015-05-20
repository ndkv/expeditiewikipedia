var wikiUtils = require('./wiki-utils');

function loadContent(contentSwiper, poisList, currentExpedition) {
	contentSwiper.removeAllSlides();
	var wikiUrl = poisList[currentPoi - 1][1]['Wikipedia link'];
	var imageUrl = poisList[currentPoi - 1][1].Afbeelding;
	if (wikiUrl.length > 0) {
		wikiUtils.fetchWikiExcerpt(wikiUrl, imageUrl, 600, true, contentSwiper, currentExpedition);
	}
}

function buildPoiList (pois, previewItems, currentExpedition, toggleDetailView, contentSwiper) {
	var $previewListContent = $('<div id="previewListContent"></div>');
	var $swiperSlide = $('#previewSwiper .swiper-slide');

	var sortable = [];
	$.each(pois, function(index, poi) {
		sortable.push([
			poi[0].order,
			poi[0]
			// poi[0].title,
			// poi[0].summary,
			// poi[0].Afbeelding,
			// poi[0]['Wikipedia link'],
			// poi[0].type
		]);
	});

	sortable.sort(function(a, b) { return a[0] - b[0]; });
	var poisList = sortable;

	$.each(sortable, function(index, value) {
		var $expeditionPreviewSummary = $('<div class="expeditionPreviewSummary"></div>'), //.html(value[1].summary),
			$expeditionPreviewTitle = $('<div></div>').html(value[1].title);

		var $expeditionContent = $('<div></div>')
		.append($expeditionPreviewTitle);
		//.append($expeditionPreviewSummary);

		var $expeditionItem = $('<div class="expeditionItem"></div>')
		.append($expeditionContent);

		var afbeelding = value[1].Afbeelding,
			type = value[1].type;
		
		var $readMore = $('<div class="readMore"><span>Lees meer</span></div>');

		if (type === 'Beeld' || type === 'kaart') {
			wikiUtils.fetchWikiImage(afbeelding, 100, addImageToMenu, currentExpedition, $expeditionPreviewTitle);
			
			$readMore = $('<div class="readMore"><span>Bekijk afbeelding</span></div>');			
			$readMore.click(function () { buildFancyboxImage(index, value, currentExpedition, afbeelding); });

			//hacks, fix
			$expeditionPreviewTitle.addClass('expeditionPreviewTitle');
			$expeditionPreviewTitle.css('padding-bottom', '40px');

		} else if (type === 'Artikel'|| currentExpedition === 'vening-meinesz') {
			if (value[1].summary === '') {
				wikiUtils.fetchWikiImage(afbeelding, 100, addArticleImageToMenu, currentExpedition, $expeditionPreviewTitle);
			} else {
				$expeditionContent.append($expeditionPreviewSummary);
				$expeditionPreviewSummary.html(value[1].summary);
			}

			$readMore.click(function () {
				currentPoi = value[0];
				toggleDetailView();
				contentSwiper.swipeTo(index);

				if (currentExpedition !== "vening-meinesz") {
					setTimeout(function() { loadContent(contentSwiper, poisList, currentExpedition); }, 300);					
				}

				$('.expedition-subtitle').html(value[1].title);
				$('#contentSwiper .swiper-slide').css('height', 440);
				$('#contentSwiper .swiper-slide').addClass('scroll');
			});

			// $expeditionPreviewTitle.addClass('expedition-preview-title-article');
			$expeditionPreviewTitle.addClass('expeditionPreviewTitle');
		}

		var $container = $('<div class="expeditionItemContainer"></div>');
		$container.append($expeditionItem);
		$container.append($readMore);

		previewItems.push($expeditionItem);
		$swiperSlide.append($container);
	});

	var margin = 20;

	var width = (pois.length * $('.expeditionItem').width()) + pois.length * margin * 2 - 150;
	$swiperSlide.width(width);
	$previewListContent.width(width);

	return poisList;
}

function buildFancyboxImage(index, value, currentExpedition, afbeelding) {
	var currentPreviewItem = index,
		currentPoi = value[0],
		imageName = afbeelding.split('File:')[1],
		commons = ', bron: <a class="commons" href="' + afbeelding + '" target="_blank">Wikimedia Commons</a>.',
		title = (value[1].summary !== '') ? value[1].summary + ' ' + value[1].Datum + '<br />' : '',
		instelling = (value[1].Instelling !== '') ? 'Instelling: ' + value[1].Instelling : '',
		caption = title + instelling,
		requestUrl = wikiUtils.constructWikiImageUrl(imageName, 1000) + '&format=json';

	$.ajax({
		url: requestUrl,
		jsonp: "callback",
		dataType: "jsonp", 
		success: function(data) {
			var bigViewUrl,
				fancyboxTitle;

	    	try {						    		
	    		bigViewUrl = data.query.pages['-1'].imageinfo[0].thumburl;
	    		fancyboxTitle = caption + commons;
	    	}
	    	catch (err) {
	    		console.log('Warning, failed to load big image');
	    		console.log('Assuming local image');

	    		bigViewUrl = 'data/' + currentExpedition + '/images/' + afbeelding;
	    		fancyboxTitle = caption;
	    	}

	    	$.fancybox.open([{
	    		href:bigViewUrl,
	    		title: fancyboxTitle,
	    		fitToView: true
	    	}]);
	    }
	});
}

function addImageToMenu(imageUrl, $expeditionPreviewSummary) {
	$img = $('<img class="expedition-preview-image" src="' + imageUrl +'">')
	// .css('padding-top', '0')
	.insertAfter($expeditionPreviewSummary);
}

function addArticleImageToMenu(imageUrl, $expeditionPreviewSummary) {
	$img = $('<img class="expedition-preview-image" src="' + imageUrl +'">')
	// .css('padding-top', '0')
	.insertAfter($expeditionPreviewSummary);
}

module.exports = buildPoiList;