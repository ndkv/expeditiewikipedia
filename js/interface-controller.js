//TODO remove expedition controller from here and create an event creation
//function
var InterfaceController = function(ExpeditionController) {
	var expeditions = ExpeditionController.expeditions,
		expeditionsHash = {},
		previewItems = [],
		that = this,
		currentPoi,
		currentExpedition,
		currentExpeditionIndex,
		currentPreviewItem,
		currentLanguage = "NL",
		swiper,
		mode = "landing",
		poisList,
		menuFolded = false;

	$('.fancybox').fancybox({
        helpers: {
            overlay: {
                css: {
                    'background': 'rgba(0, 0, 0, 0.95)',
                    'z-index': '1001'
                }
            }
        }
    });

	$.each(expeditions, function(index, value) {
		expeditionsHash[value.id] = index;
	});

	var attachFastClick = require("fastclick");
	attachFastClick(document.body);
	
	var contentSwiper = new Swiper('#contentSwiper', {
			mode: 'horizontal',
			//scrollContainer: true,
			slidesPerView: 1
		});
	
	var $contentSwiper = $("#contentSwiper"),
		$previewSwiper = $("#previewSwiper"),
		$swiperMenu = $('#swiperMenu'),
		$previewList = $('#previewList');
  
	$(document)
		.on('click', '#btnToggleTopDrawer', function() { toggleTopDrawer(); })
		.on('click', '#btnStartExpedition', function(e) {
			//trigger startExpedition through trigger/bind
			ExpeditionController.startExpedition(currentPreviewItem);
			window.location.hash = expeditions[currentPreviewItem].id;
			//empy content window to stop youtube movie if running;
			contentSwiper.removeAllSlides();
		})
		.on('click', '#btnBack', function(e) { 
			that.toggleDetailView();
			//stop youtube movie
			setTimeout(function() {
				contentSwiper.removeAllSlides();				
			}, 300);

		})
		.on('click', '#btnMapDrawer', function(e) { 
			$('#lstMap').toggleClass('active');
			console.log('opening map drawer'); 
		});

	$(window).on('hashchange', function() {
		var hash = window.location.hash;
		//emulate push of back button as it removes the hash
		if (mode === 'expedition' && window.location.hash === '') {
			window.location.href = window.location.href.substr(0, window.location.href.length - 1);
		}
	}); 

	$('#btnZoomIn').click(function() { $(document).trigger('_mapZoomIn'); });
	$('#btnZoomOut').click(function() { $(document).trigger('_mapZoomOut'); });

	$('#btnMenuScrollRight').click(function() {
		scrollMenu('right');
	});

	$('#btnMenuScrollLeft').click(function () {
		scrollMenu('left');
	});

	var $menuContentContainer = $('#menuContentContainer'),
		$menuContainer = $('#menuContainer'),
		$menuContent = $('#menuContent');

	$('#btnMenu').click(function() { 
		$menuContainer.toggleClass('active');
		// this.toggleClass('active');
	});

	$('.language').click(function() {
		var lang = this.innerHTML;
		currentLanguage = lang;

		changeInterfaceLanguage(lang);

	});


	$('.menu-item').click(function() {
		el = this.id + currentLanguage;

		$('#'+el).fancybox({
			maxWidth: 500
		})
		.trigger('click');
	});

	$('#btnMenuClose').click(function() {
		$menuContentContainer.toggleClass('active');
		$('#menuBlackout').removeClass('active');
	});
		
    this.toggleDetailView = function() { 	
    	$contentSwiper.toggleClass('active');
    	//contentSwiper.updateContainerSize();
    	$(".detailedDrawer").toggleClass('high');
    	//hack, fix

    	$swiperMenu.toggleClass('hidden');

    	$('#btnMenuScrollRight').toggleClass('hidden');
    	$('#btnMenuScrollLeft').toggleClass('hidden');
    	$('#btnToggleTopDrawer').toggleClass('hidden');

    	$('#btnBack').toggleClass('active');

    	$('.expedition-title').toggleClass('active');
    	$('.expedition-title').html(expeditions[expeditionsHash[currentExpedition]].title);
    };
    
	this.togglePreviewItem = function(index) {
		console.log(currentPreviewItem);
		if (currentPreviewItem !== undefined) {
			previewItems[currentPreviewItem].removeClass("previewItemActive");
		}

		currentPreviewItem = index;
		previewItems[index].addClass("previewItemActive");

		if (menuFolded === true) { toggleTopDrawer(); }
	};

	this.togglePreviewItemLanding = function(id) {
		if (currentPreviewItem !== undefined) {
			previewItems[currentPreviewItem].removeClass("previewItemActive");
		}

		//hack, fix
		var index;
		$.each(expeditions, function(i, value) {
			if (value.id === id) { index = i; }
		});

		currentPreviewItem = index;
		previewItems[index].addClass("previewItemActive");

		if (menuFolded === true) { toggleTopDrawer(); }
		console.log(menuFolded);
	};

	this.registerMapEventsRoute = function() {
		$.each(previewItems, function(index, item) {
			var $el = item; //.children().first();

			$el.click(function() {
				//check if user is not dragging menu
				if (swiperStill()) {
					that.togglePreviewItem(index);
					$el.trigger({
						type: 'mapZoomToRoute',
						expeditionId: expeditions[index].id,
						zoomTo: expeditions[index].zoomto
					});			
				}
			});
		});
	};

	this.registerMapEventsPois = function() {
		$.each(previewItems, function(index, item) {
			var $el = item; //.children().first();

			$el.click(function(e) {
				if (swiperStill()) {
					e.preventDefault();
					that.togglePreviewItem(index);
					$el.trigger({
						type: 'mapZoomToPoI',
						vmIndex: index
					});					
				}
			});
		});
	};

	//
	//VIEWING MODE
	// 

	//TODO change name to reflect control in css/html
	var buildSwiper = function() {
		// swiper = new Swiper('.swiper-container', {
		swiper = new Swiper('#previewSwiper', {
			mode: 'horizontal',
			scrollContainer: true,
			preventClicks: true,
			// onTransitionStart: function() { console.log('swiping') ;}
		});
	};

	this.buildLandingView = function() {
		mode = "landing";
		var $previewListContent = $('<div id="previewListContent"></div>');

		var width = (expeditions.length * 195) + 4*20;
		$previewListContent.width(width);
		//previewListContent.appendTo(previewList);

		$.each(expeditions, function(index, value) {
			var $expeditionItem = $('<div class="expeditionItem"></div>');
			previewItems.push($expeditionItem);

			var $expeditionContent = $('<div></div>');
			$expeditionContent.appendTo($expeditionItem);

			var $expeditionTitle = $('<div class="expeditionPreviewTitle"></div>');
			$expeditionTitle.html(value.title);
			$expeditionTitle.appendTo($expeditionContent);

			//hack, fix
			$expeditionTitle.css('padding-bottom', '40px');

			//tweetaligheid
			var $readMore = $('<div class="readMore"><span>Lees meer</span></div>');
			// $readMore.appendTo($expeditionItem);

			var $container = $('<div class="expeditionItemContainer"></div>');
			$container.append($expeditionItem);
			$container.append($readMore);
			
			$readMore.click(function () {
				currentPreviewItem = index;
				currentExpedition = expeditions[index].id;
				that.toggleDetailView();
				setTimeout(function() { that.loadContent(); }, 500);
			});

			// $('.swiper-slide').width(width);
			// $expeditionItem.appendTo($('.swiper-slide'));
			$('#previewSwiper .swiper-slide').width(width);
			// $expeditionItem.appendTo($('#previewSwiper .swiper-slide'));
			$container.appendTo($('#previewSwiper .swiper-slide'));

			if (value.image !== "") {
				var imageUrl = fetchWikiImage(value.image, $expeditionItem);
			}
		});

		//change language
		$('.spacer-left-title').html('kies een reis');
		$('.spacer-left-summary').html('stap in en doe mee met de interessante expedities en ontdek alles over geschiedenis en techniek en leer wat wetenschap zo rijk maakt!');

		buildSwiper();
		// buildMapsList();
	};

	this.loadContent = function() {
		contentSwiper.removeAllSlides();
		if (mode == 'landing') {
			//fetch introteskt from Excelsheet
			loadIntroTexts();
		} else {
			if (currentExpedition === "vening meinesz") {
				loadVMExpedition();
			} else {
				var wikiUrl = poisList[currentPoi - 1][1]['Wikipedia link'];
				if (wikiUrl.length > 0) {
					fetchWikiExcerpt(wikiUrl, 500, true);
					// $('.wiki-leesmeer a').prop('href', wikiUrl);
				}
			}
		}
	};

	this.destroyLandingView = function() {
		//console.log("destroy LandingView");
		swiper.destroy();
		$('#previewSwiper .swiper-wrapper').empty();		//cleans event listeners too
		
		//prepare a new swier slide
		$('<div class="swiper-slide"></div>').appendTo($('#previewSwiper .swiper-wrapper'));
		that.toggleDetailView();

		$('.spacer-left-title').html("");
		$('.spacer-left-summary').html("");

		// $('#lstMap').empty();

		previewItems = [];
	};

	this.buildExpeditionView = function(expedition, expeditionIndex, pois) {
		//read expedition texts and place them on interface
		mode = "expedition";
		currentExpedition = expedition;
		currentExpeditionIndex = expeditionIndex;

		var expeditionAttributes = expeditions[expeditionsHash[expedition]];

		$('#btnMapDrawer').toggleClass('active');

		buildPoIList(pois);
		buildMapsList();

		//hide and show interface elements
		//TODO toggle visibility through class and translate
		$('#btnLanguage').css('transform', 'translate3d(0px, -500px, 0px)');
		$('#btnStartExpedition').css('display', 'none');

		$('.spacer-left-title').html(expeditionAttributes.title);
		$('.spacer-left-summary').html(expeditionAttributes.summary);

		$('.expedition-title').html(expeditions[expeditionsHash[currentExpedition]].title);
		$('.expedition-title').addClass('active');

		$('#overview').css('display', 'block');
		if (currentLanguage === 'EN') { $('#overview a').html('&#8592; Expeditions'); }
		console.log(currentLanguage);

		if (currentExpedition === 'vening meinesz') {
			$('#contentSwiper').addClass('scroll');
		}
	};

	var buildPoIList = function (pois) {
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
		poisList = sortable;

		$.each(sortable, function(index, value) {
			var $expeditionPreviewSummary = $('<div class="expeditionPreviewSummary"></div>').html(value[1].summary),
				$expeditionPreviewTitle = $('<div class="expeditionPreviewTitle"></div>').html(value[1].title);

			var $expeditionContent = $('<div></div>')
			.append($expeditionPreviewTitle)
			.append($expeditionPreviewSummary);

			var $expeditionItem = $('<div class="expeditionItem"></div>')
			.append($expeditionContent);

	        var $readMore = $('<div class="readMore"><span>Lees meer</span></div>');			
			$readMore.click(function () {
				currentPreviewItem = index;
				currentPoi = value[0];
				that.toggleDetailView();
				// that.togglePreviewItem(index);

				setTimeout(function() { that.loadContent(); }, 300);				
			});

			var afbeelding = value[1].Afbeelding;
			//TODO change to type check of POI
			if (afbeelding !== "") {
				//VM expedition doesn't have images, hence this check
				if (afbeelding !== undefined) {
					fetchWikiImage(afbeelding, $expeditionItem);
					
					$readMore = $('<div class="readMore"><span>Bekijk afbeelding</span></div>');			
					$readMore.click(function () {
						currentPreviewItem = index;
						currentPoi = value[0];
						
						//fetch wikiImageUrl
						var imageName = afbeelding.split('File:')[1];
						var requestUrl = constructWikiImageUrl(imageName, 1000) + '&format=json';
						$.ajax({
   							url: requestUrl,
 			    			jsonp: "callback",
			    			dataType: "jsonp",
			    			success: function(data) {
						    	try {
						    		var commons = 'bron: <a class="commons" href="' + afbeelding + '" target="_blank">Wikimedia Commons</a>.',
						    			bigViewUrl = data.query.pages['-1'].imageinfo[0].thumburl;
						    		
						    		var title = (value[1].summary !== '') ? value[1].summary + ' ' + value[1].Datum + '<br />' : '';
						    		var instelling = (value[1].Instelling !== '') ? 'Instelling: ' + value[1].Instelling + ', ' : '';
						    		var caption = title + instelling + commons;
						    			
									$.fancybox.open([{
										href:bigViewUrl , title: caption
									}]);
						    	}
						    	catch (err) {
						    		console.log('Warning, failed to load big image');
						    		console.log(err);
						    	}
						    }
						});
					});

					//hacks, fix
					$expeditionPreviewTitle.css('padding-bottom', '40px');
					$expeditionPreviewSummary.empty();
				}
			}

			//$expeditionItem.after($readMore);
			// $expeditionItem.append($readMore);

			var $container = $('<div class="expeditionItemContainer"></div>');
			$container.append($expeditionItem);
			$container.append($readMore);

			previewItems.push($expeditionItem);
			$swiperSlide.append($container);


			//change interface language
			//hack, fix
			if (currentExpedition === 'vening meinesz') {
				currentLanguage = 'EN';
				changeInterfaceLanguage('EN');
				// $.each($readMore, function(index, value) {
				// 	value.firstChild.innerHTML = 'Read more';
				// });
			}
			
		});

		var margin = 20;

		var width = (pois.length * $('.expeditionItem').width()) + pois.length * margin * 2;
		$swiperSlide.width(width);
		$previewListContent.width(width);

		buildSwiper();
	};

	var buildMapsList = function() {
		var $mapList = $('#lstMap');

		var maps = [];
		if (mode === 'landing') {
			$.each(expeditions, function(index, expedition) {
				maps.push.apply(maps, expedition.maps);
			});
		} else {
			maps = expeditions[currentExpeditionIndex].maps;

			if (maps === undefined) { maps = []; }
		}

		//try {
			$.each(maps, function(index, value) {
				$mapList.append('<div></div>');

				var $checkbox = $('<input type="checkbox">');
				$checkbox.click(function() {
					$checkbox.trigger('_toggleOverlayVisibility', [value.id]);
				});
				
				var label = $('<label></label>')
				.append($checkbox) 
				.append($('<div>' + value.title + '</div>'));

				if (mode === 'landing' && value.visibleIntro === true) {
					$checkbox[0].checked = true;
					label.appendTo($mapList.children().last());
				} else if (mode === 'expedition') {
					label.appendTo($mapList.children().last());

					if (value.visibleExpedition === true) {
						$checkbox[0].checked = true;
					}
				}				
			});
		//}
		//catch (e) {
		//	$('#btnMapDrawer').css('opacity', 0);
		//	console.log("Warning, this expedition does not have any maps.");
		//}
		//$mapList.find('input')[0].checked = true;
	};

	var fetchWikiImage = function(url, elem) {
		var imageName = url.split("File:")[1];
		var requestUrl = constructWikiImageUrl(imageName, 100) + '&format=json';
		var imageUrl;

		$.ajax({
   				url: requestUrl,
 			    jsonp: "callback",
			    dataType: "jsonp",
			    beforeSend: function() {
			    	// put spinner on slide page
			    },
			    success: function(data) {
			    	try {
						imageUrl = data.query.pages['-1'].imageinfo[0].thumburl;			    		
			    	}
			    	catch (err) {
			    		console.log("warning, failed to fetch Wikipedia Image");
			    		console.log(url);
			    	}

					elem.css('background-image', 'url(' + imageUrl + ')');
			    }
		});
	};

	var constructWikiImageUrl = function(imageName, h) {
		var title = 'titles=File:' + imageName + '&',
			height = 'iiurlheight=' + h;

		return 'http://en.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&' + title + height;
	};

	var loadVMExpedition = function() {
		var poi = poisList[currentPoi - 1];
		var path = 'data/' + currentExpedition + '/pois/' + poi[1].prefix + ' ' + poi[1].title + '.htm';

		$.get(path, function(data) {
			var columns = $('<div class="columns"></div>');
			var $data = $(data);
			var images = $data.find('img');

			$.each(images, function(index, value) {
				//resize images so they fit in column width
				var urlPieces = $(value).prop('src').split('/'),
					folder = urlPieces[urlPieces.length - 2],
					file = urlPieces[urlPieces.length - 1];

				var imageUrl = 'data/' + currentExpedition + '/pois/' + folder + '/' + file;

				$image = $(value);
				$image.prop('src', imageUrl);

				var height = $image.prop('height'),
					width = $image.prop('width'),
					ratio = height/width,
					columnWidth = 300;
				
				$image.prop('height', columnWidth * ratio);

				console.log(file);
				var largeFile = 'image00' + (parseInt(file.split('0')[2].split('.')[0]) - 1) + '.jpg';
				var imageUrlLarge = 'data/' + currentExpedition + '/pois/' + folder + '/' + largeFile;
				var $fancybox = $('<a class="fancybox" href="' + imageUrlLarge + '"></a>');
				$fancybox.appendTo($image.parent());
				$image.detach().appendTo($fancybox);


			});

			columns.append($data);

			var slide = contentSwiper.createSlide(columns[0].outerHTML);
			slide.append();
		});
	};

	var fetchWikiExcerpt = function(url, numWords, columns) {
		// var contentElem = $('<div></div>');
		
		try {
			wikiUrl = url.split('/');
			title = wikiUrl[wikiUrl.length - 1];
			var wikiApiUrl = 'http://nl.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&',
		    numOfChars = 'exchars=' + numWords + '&',
		    articleTitle ='titles=' + title,
		    requestUrl = wikiApiUrl + numOfChars + articleTitle;

		    $.ajax({
   				url: requestUrl,
 			    jsonp: "callback",
			    dataType: "jsonp",
			    beforeSend: function() {
			    	// put spinner on slide page
			    },
			    success: function(data) {
					var pages = data.query.pages;
					for (var page in pages) { break; }
					
					var $content = $('<div class="expedition-text-content"></div>'), 
						$contentElem = $('<div></div>'),
						$contentImage = $('<div class="expedition-text-image"></div>');
						$wikiText = $('<div class="wiki-attribution">Uit Wikipedia, de vrije encyclopedie</div>');
						$wikiText.append($(pages[page].extract).filter('p'));

					$content.append($wikiText);
					//add link to article
					$content.append($('<div class="wiki-leesmeer"><a href="'+ url + '" target="_blank"><img src="images/icons/wikipedia leesmeer.png" alt=""></a></div>'));
					$contentImage.append('<img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/COLLECTIE_TROPENMUSEUM_S.S._Van_Goens_langs_een_steiger_met_op_de_achtergrond_Poelau_Maitara_TMnr_60010092.jpg">');

					$contentElem.append($content);
					$contentElem.append($contentImage);

					var slide = contentSwiper.createSlide($contentElem[0].outerHTML);
					slide.append();

			    }
			});			
		}
		catch (err) {
			var message = "<div>Deze expeditie heeft nog geen Wikipedia lemma. \n Help mee en schrijf er &eacute&eacuten!</div>";
			contentElem.addClass('columns-none');
			contentElem.css('font-size', '1.5em');
			contentElem.append(message);
			var slide = contentSwiper.createSlide(contentElem[0].outerHTML);
			slide.append();
		}

	};

	var swiperStill = function() {
		var touches = swiper.touches;
		return touches.start === touches.current;
	};


	var changeInterfaceLanguage = function (lang) {
		var $readMore = $('.readMore');

		if (lang === 'EN') {
			currentLanguage = 'EN';
			$.each($readMore, function(index, value) {
				value.firstChild.innerHTML = 'Read more';
			});

			$('#introTitleNL').removeClass('active');
			$('#introTitleEN').addClass('active');
			$('#introNL').removeClass('active');
			$('#introEN').addClass('active');

		} else {
			currentLanguage = 'NL';

			$.each($readMore, function(index, value) {
				value.firstChild.innerHTML = 'Lees meer';
			});

			// $('#btnBack').text('Terug');
			$('#btnStartExpedition').text('Start expeditie!');

			$('#introTitleNL').addClass('active');
			$('#introTitleEN').removeClass('active');
			$('#introEN').removeClass('active');
			$('#introNL').addClass('active');			
		}

		if (mode === "landing") {
			//reload content in correct language
			that.loadContent();	
		}

		//if introtext pane open, change language there too
	};

	var changeIntroLanguage = function() {

	};

	var loadIntroTexts = function() {
		// contentSwiper.removeAllSlides();
		var $content = $('<div class="intro-text-content"></div>'), 
			$contentElem = $('<div></div>'),
			$contentImage = $('<div class="intro-text-image"></div>'), 
			$img = $('<img>'),
			expedition = expeditions[expeditionsHash[currentExpedition]];

		var buttonText;
		if (currentLanguage === 'EN') {
			// $content.html('Introduction text from Excel sheet');
			$content.html(expedition.introGB);
			buttonText = 'Start expedition!';
		} else {
			// $content.html('Introductie tekst uit Excel sheet');
			// $content.html('<a class="fancybox fancybox.iframe" href="https://www.youtube.com/embed/C_91XgjvqxA?autoplay=1"><img src="images/intro/vm-youtube.png" height="299"></a>');
			$content.html(expedition.introNL);
			buttonText = 'Start expeditie!';
		}

		
		$content.append($('<div><button class="btnDetailedDrawer" id="btnStartExpedition">'+ buttonText +'</button></div>'));

		$contentElem.append($content);
		$contentElem.append($contentImage);

		var slide = contentSwiper.createSlide($contentElem[0].outerHTML);
		slide.append();

		setTimeout(function() {
			$img.prop('src', 'images/intro/' + currentExpedition + '.jpg');
			$('.intro-text-image').append($img);
		}, 200);
	};

	var scrollMenu = function(direction) {

		var moveDirection = (direction === 'right') ? -300 : 300;

		var $swiper = $('.swiper-wrapper');
		var spacerRightWidth = 50;
		var spacerLeftWidth = 150;
		var docWidth = $(document).width();
		var docSwiperDiff = docWidth - $swiper.width() - spacerRightWidth;

		var move = $swiper.position().left + moveDirection;
		// if (Math.abs($swiper.position().left) >= $swiper.width()) { move = -$swiper.width(); }
		if ($swiper.position().left + moveDirection > 0) { move = 0; }
		console.log('test move');

		var translate = 'translate3d(' + move + 'px, 0px, 0px';
		
		$swiper.css('transition', 'transform .5s');
		$swiper.css('transform', translate);
		$swiper.css('-webkit-transition', '-webkit-transform .5s');
		$swiper.css('-webkit-transform', translate);
		$swiper.css('-moz-transition', '-moz-transform .5s');
		$swiper.css('-moz-transform', translate);
		$swiper.css('-o-transition', '-o-transform .5s');
		$swiper.css('-o-transform', translate);
	};

	var toggleTopDrawer = function() {
		$('.detailedDrawer').toggleClass('active');
		$swiperMenu.toggleClass('hidden');

		var image = $('#btnToggleTopDrawer').find('img');
		var src = (image.prop('src').split('/').pop() === 'close.svg') ? 'images/icons/open.svg' : 'images/icons/close.svg';
		image.prop('src', src);

		menuFolded = (menuFolded === false) ? true : false;
	};

};



module.exports = InterfaceController;