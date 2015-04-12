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
		menuFolded = false,
		$contentSwiper = $("#contentSwiper"),
		$previewSwiper = $("#previewSwiper"),
		$swiperMenu = $('#swiperMenu'),
		$previewList = $('#previewList'),
		$menuContentContainer = $('#menuContentContainer'),
		$menuContainer = $('#menuContainer'),
		$menuContent = $('#menuContent'),
		poiClicked = false;
		
	//map expeditions integer ids to string ids
	$.each(expeditions, function(index, value) {
		expeditionsHash[value.id] = index;
	});

	$('.fancybox').fancybox({
		// fitToView: false,
        helpers: {
            overlay: {
                css: {
                    'background': 'rgba(0, 0, 0, 0.95)',
                    'z-index': '1001'
                }
            }
        }
    });

	var attachFastClick = require("fastclick");
	attachFastClick(document.body);
	
	var contentSwiper = new Swiper('#contentSwiper', {
			mode: 'horizontal',
			//scrollContainer: true,
			slidesPerView: 1,
			preventLinksPropagation: true,
			preventLinks: true,
			// calculateHeight: true,
			onSlideChangeEnd: function() {
				if (!poiClicked) {
					$(document).trigger({
						type: 'mapZoomToPoI',
						vmIndex: contentSwiper.activeIndex,		
					});				
				}

				poiClicked = false;
		
				$('.expedition-subtitle').html(poisList[contentSwiper.activeIndex][1].title);

				centerMainMenu(contentSwiper.activeIndex);
			}
	});

	function buildSwiper() {
		// swiper = new Swiper('.swiper-container', {
		swiper = new Swiper('#previewSwiper', {
			mode: 'horizontal',
			scrollContainer: true,
			preventClicks: true,
			// onTransitionStart: function() { console.log('swiping') ;}

		});
	}
	
    function toggleDetailView() {
    	$contentSwiper.toggleClass('active');
    	$(".detailedDrawer").toggleClass('high');

    	$swiperMenu.toggleClass('hidden');

    	$('#btnMenuScrollRight').toggleClass('hidden');
    	$('#btnMenuScrollLeft').toggleClass('hidden');
    	$('#btnToggleTopDrawer').toggleClass('hidden');
    	$('.content-controls').toggleClass('active');

    	toggleTitle();

    }
    
	function togglePreviewItem(index) {
		// console.log(currentPreviewItem);
		if (currentPreviewItem !== undefined) {
			previewItems[currentPreviewItem].removeClass("previewItemActive");
		}

		currentPreviewItem = index;
		previewItems[index].addClass("previewItemActive");

		// console.log('swiping to... ' + index);
		// poiClicked = true;
		// contentSwiper.swipeTo(index);

		if (menuFolded === true) { toggleTopDrawer(); }
	}

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
	};

	this.registerMapEventsRoute = function() {
		$.each(previewItems, function(index, item) {
			var $el = item; //.children().first();

			$el.click(function() {
				//check if user is not dragging menu
				if (swiperStill()) {
					//that.togglePreviewItem(index);
					centerMainMenu(index);
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
					// that.togglePreviewItem(index);
					centerMainMenu(index);
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
				toggleDetailView();
				setTimeout(function() { loadContent(); }, 500);
			});

			// $('.swiper-slide').width(width);
			// $expeditionItem.appendTo($('.swiper-slide'));
			$('#previewSwiper .swiper-slide').width(width);
			// $expeditionItem.appendTo($('#previewSwiper .swiper-slide'));
			$container.appendTo($('#previewSwiper .swiper-slide'));

			if (value.image !== "") {
				var imageUrl = fetchWikiImage(value.image, 100, function(imageUrl) { $expeditionItem.css('background-image', "url('" + imageUrl + "')"); });
			}
		});

		//change language


		buildSwiper();
	};

	function loadContent() {
		contentSwiper.removeAllSlides();
		if (mode == 'landing') {
			//fetch introteskt from Excelsheet
			loadIntroTexts();
		} else {
			var wikiUrl = poisList[currentPoi - 1][1]['Wikipedia link'];
			var imageUrl = poisList[currentPoi - 1][1].Afbeelding;
			if (wikiUrl.length > 0) {
				fetchWikiExcerpt(wikiUrl, imageUrl, 600, true);
				// $('.wiki-leesmeer a').prop('href', wikiUrl);
			}
		}
	}

	this.destroyLandingView = function() {
		//console.log("destroy LandingView");
		swiper.destroy();
		$('#previewSwiper .swiper-wrapper').empty();		//cleans event listeners too
		
		//prepare a new swier slide
		$('<div class="swiper-slide"></div>').appendTo($('#previewSwiper .swiper-wrapper'));
		toggleDetailView();

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

		if (currentExpedition === "vening-meinesz") {
			setTimeout(loadVMExpedition, 1000);
		}

		//hide and show interface elements
		//TODO toggle visibility through class and translate
		$('#btnLanguage').css('transform', 'translate3d(0px, -500px, 0px)');
		$('#btnStartExpedition').css('display', 'none');

		$('.spacer-left-title').html(expeditionAttributes.title);
		$('.spacer-left-summary').html(expeditionAttributes.summary);

		$('.expedition-title').html(expeditions[expeditionsHash[currentExpedition]].title);
		$('.expedition-title').addClass('active');

		$('#overview > a').css('display', 'block');
		
		if (currentLanguage === 'EN') { $('#overview a').html('&#8592; Expeditions'); }
		console.log(currentLanguage);

		if (currentExpedition === 'vening-meinesz') {
			// $('#contentSwiper .swiper-slide').css('height', 440);
			// $('#contentSwiper .swiper-slide').css('overflow', 'auto');

			$('.content-control').addClass('active');
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
				//currentPreviewItem = index;
				currentPoi = value[0];
				toggleDetailView();
				// togglePreviewItem(index);
				console.log('swiping to... ' + index);
				contentSwiper.swipeTo(index);
				console.log('activeIndex...' + contentSwiper.activeIndex);

				console.log(poisList[index][1].title);



				$('.expedition-subtitle').html(value[1].title);

				if (currentExpedition !== "vening-meinesz") {
					setTimeout(function() { loadContent(); }, 300);					
				}

				$('#contentSwiper .swiper-slide').css('height', 440);
				$('#contentSwiper .swiper-slide').addClass('scroll');
			});

			var afbeelding = value[1].Afbeelding,
				type = value[1].type;
			//TODO change to type check of POI
			if (type === 'Beeld' || type === 'kaart') {
				var callback = function(imageUrl) { 
					$img = $('<img class="expedition-preview-image" src="' + imageUrl +'">')
					.insertAfter($expeditionPreviewSummary);
				};

				fetchWikiImage(afbeelding, 100, callback);
				
				$readMore = $('<div class="readMore"><span>Bekijk afbeelding</span></div>');			
				$readMore.click(function () {
					currentPreviewItem = index;
					currentPoi = value[0];
					
					//fetch wikiImageUrl
					var imageName = afbeelding.split('File:')[1];

					var commons = 'bron: <a class="commons" href="' + afbeelding + '" target="_blank">Wikimedia Commons</a>.';
					var title = (value[1].summary !== '') ? value[1].summary + ' ' + value[1].Datum + '<br />' : '';
					var instelling = (value[1].Instelling !== '') ? 'Instelling: ' + value[1].Instelling + ', ' : '';
					var caption = title + instelling + commons;

					var requestUrl = constructWikiImageUrl(imageName, 1000) + '&format=json';
					$.ajax({
							url: requestUrl,
			    			jsonp: "callback",
		    			dataType: "jsonp", 
		    			success: function(data) {
					    	try {						    		
					    			bigViewUrl = data.query.pages['-1'].imageinfo[0].thumburl;
								$.fancybox.open([{
									href:bigViewUrl,
									title: caption,
									fitToView: true
								}]);
					    	}
					    	catch (err) {
					    		console.log('Warning, failed to load big image');
					    		console.log(err);
					    		console.log('Assuming local image');

					    		bigViewUrl = 'data/' + currentExpedition + '/images/' + afbeelding;
					    		$.fancybox.open([{
									href:bigViewUrl,
									title: caption,
									fitToView: true
								}]);
					    	}
					    }
					});
				});

				//hacks, fix
				$expeditionPreviewTitle.css('padding-bottom', '40px');
				$expeditionPreviewSummary.empty();
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
			if (currentExpedition === 'vening-meinesz') {
				changeInterfaceLanguage('EN');
			}
			
		});

		var margin = 20;

		var width = (pois.length * $('.expeditionItem').width()) + pois.length * margin * 2 - 150;
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
	};

	var fetchWikiImage = function(url, size, callback) {
		var imageName = url.split("File:")[1];
		var requestUrl = constructWikiImageUrl(imageName, size) + '&format=json';
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
			    		console.log("Warning, failed to fetch Wikipedia Image");
			    		console.log("Assuming local image...");

			    		imageUrl = 'data/' + currentExpedition + '/images/' + url;

			    	}
			    	callback(imageUrl);
			    }
		});
	};

	var constructWikiImageUrl = function(imageName, h) {
		var title = 'titles=File:' + imageName + '&',
			height = 'iiurlheight=' + h;

		return 'http://en.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&' + title + height;
	};

	var loadVMExpedition = function(index) {
		// $.each(poisList, function(index, poi) {

		if (index === undefined) { index = 0; }
		var poi = poisList[index];

		var path = 'data/' + currentExpedition + '/pois/' + poi[1].prefix + ' ' + poi[1].title;

		$.get(path + '.htm', {async: false})
		.done(function(data) {
			console.log(path);
			var columns = $('<div class="columns"></div>');
			var $data = $(data);
			var images = $data.find('img');

			$.each(images, function(index, value) {
				//resize images so they fit in column width
				var urlPieces = $(value).prop('src').split('/'),					
					file = urlPieces[urlPieces.length - 1],
					folder = urlPieces[urlPieces.length - 2];

				var imageUrl = 'data/' + currentExpedition + '/pois/' + folder + '/' + file;

				$image = $(value);
				$image.prop('src', imageUrl);

				var height = $image.prop('height'),
					width = $image.prop('width'),
					// ratio = width/height,
					ratio = height/width,
					columnWidth = 300,
					maxHeight = 400;
				
				// $image.prop('height', columnWidth * ratio);
				// $image.prop('width', columnWidth);

				// console.log(ratio);
				if (ratio > 1) {
					$image.prop('height', maxHeight);
					$image.prop('width', maxHeight / ratio);
				} else {
					// console.log(columnWidth * ratio);
					$image.prop('height', columnWidth * ratio);
					$image.prop('width', columnWidth);
				}
				

				// $image.prop('width', 10);
				// $image.prop('height', 10);

				// console.log(file);
				var largeFile = 'image00' + (parseInt(file.split('0')[2].split('.')[0]) - 1) + '.jpg';
				var imageUrlLarge = 'data/' + currentExpedition + '/pois/' + folder + '/' + largeFile;
				var $fancybox = $('<a class="fancybox" href="' + imageUrlLarge + '"></a>');
				$fancybox.appendTo($image.parent());
				$image.detach().appendTo($fancybox);
			});

			// $data.find('span').each(function(i, v) { if (v.textContent === "") { $(v).remove(); } });
			//$data.find('span').each(function(i,v) { if ($(v).children.length > 0) { $(v).remove(); } });
			// $($data.find('p')[0]).remove();

			var $embed = $data.find('iframe');

			if ($embed.length > 0) {
				var embedSrc = $embed.prop('src') + '?autoplay=1';
				var p = $embed.parent();
				$embed.remove();

				var embedUrl = path + '_files/embed.png';
				p.append($('<a class="fancybox" data-fancybox-type="iframe" href="' + embedSrc + '"><img src="' + embedUrl + '"></a>'));	
			}	

			columns.append($data);

			// console.log(columns[0]);

			var slide = contentSwiper.createSlide(columns[0].outerHTML);
			slide.append();

			if (index < poisList.length - 1) {
				loadVMExpedition(index + 1);
			}
		});
	};

	var fetchWikiExcerpt = function(url, imageUrl, numWords, columns) {
		var $contentImage = $('<div class="expedition-text-image"></div>');
			// $contentImage.css('background-image', "url('" + imageUrl + "')");
			// $('.expedition-text-image').css('background-image', "url('" + imageUrl + "')");
			// console.log(imageUrl);

			// $image.load(function() { console.log('image loaded correctly'); })
			// .error(function() { console.log('image failed to load'); })
			// .prop('src', imageUrl);
			// console.log(imageUrl);

			// document.getElementById('tessst').setAttribute('src', imageUrl);
		 // });
		
		try {
			wikiUrl = url.split('/');
			title = wikiUrl[wikiUrl.length - 1];
			var wikiApiUrl = 'http://nl.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&',
		    numOfChars = 'exchars=' + numWords + '&',
		    articleTitle ='titles=' + title,
		    requestUrl = wikiApiUrl + numOfChars + articleTitle;

		    var $content = $('<div class="expedition-text-content"></div>'), 
		    	$contentElem = $('<div></div>'),
		    	$wikiText = $('<div class="wiki-attribution">Uit Wikipedia, de vrije encyclopedie</div>');
		    	$content.append($('<div class="wiki-leesmeer"><a href="'+ url + '" target="_blank"><img src="images/icons/wikipedia leesmeer.png" alt=""></a></div>'));
		    	$contentElem.append($content);
		    	$contentElem.append($contentImage);
		    	


		    $.ajax({
   				url: requestUrl,
 			    jsonp: "callback",
			    dataType: "jsonp"
			})
			.done(function(data) {
					var pages = data.query.pages;
					for (var page in pages) { break; }
									
					$wikiText.append($(pages[page].extract).filter('p'));
					$content.append($wikiText);
					
					console.log(imageUrl);
					if (imageUrl !== '') {
						fetchWikiImage(imageUrl, 1000, function(url) {
							$('<img>')
							.attr('src', url)
		    				.appendTo($contentImage);
							
							var slide = contentSwiper.createSlide($contentElem[0].outerHTML);
							slide.append();	
						});
					} else {
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

	var appendImageToPoI = function(imageUrl) {
		// $('.expedition-text-image').append('<img src="' +  imageUrl +'"">');
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

			$('.spacer-left-title').html('choose an expedition');
			$('.spacer-left-summary').html('Enter and discover more of the scientific expeditions and research travels. Read the stories and study the scientific results.');

			$('#introTitleNL').removeClass('active');
			$('#introTitleEN').addClass('active');
			$('#introNL').removeClass('active');
			$('#introEN').addClass('active');

			$('#menuAbout').html('About Expeditie Wikipedia');
			$('#menuAboutApp').html('About this app');
			$('#menuColofon').html('Colofon');
			$('#menuSponsors').html('Sponsors');
			$('#menuContact').html('Contact us');

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
		}

		if (mode === "landing") {
			//reload content in correct language
			loadContent();	
		}

		//if introtext pane open, change language there too
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

		var $swiper = $('#previewSwiper > div.swiper-wrapper');
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

	this.initializeEvents = function() {
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
				toggleDetailView();
			})
			.on('click', '#btnContentForward', function() { contentSwiper.swipeNext(); })
			.on('click', '#btnContentBack', function() { contentSwiper.swipePrev(); })
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

			$.fancybox.open($('#'+el), {
			// $('#'+el).fancybox({
				maxWidth: 500,
				type: 'inline'
			});
			// .trigger('click');
		});

		$('#btnMenuClose').click(function() {
			$menuContentContainer.toggleClass('active');
			$('#menuBlackout').removeClass('active');
		});
	};

	function toggleTitle() {
		if (mode === "landing") {
			$('.expedition-title').toggleClass('active');
			$('.expedition-title').html(expeditions[expeditionsHash[currentExpedition]].title);	
		}

		if (mode === "expedition") 	{
			$('.expedition-subtitle').toggleClass('active');
			$('.expedition-title').toggleClass('expedition');
		}
	}

	this.centerMenus = function(index) {		
		if (contentSwiper.slides.length < 2) {
			centerMainMenu(index);			
		} else {
			poiClicked = true;
			contentSwiper.swipeTo(index);			
		}
	};

	function centerMainMenu(index) {
		console.log('centering Menu');
		togglePreviewItem(index);

		var $swiper = $('#previewSwiper div.swiper-wrapper'),
			swiperOffset = $swiper.offset().left,
			spacerLeftWidth = $('.spacer-left').width(),
			spacerRightShadow = 30,
			spacerRightWidth = $('.spacer-right').width() + spacerRightShadow,
			margin = 20,
			offset;

		var docWidth = $(document).width(),
			docSwiperDiff = docWidth - $swiper.width() - spacerRightWidth - spacerLeftWidth;

		var	$element = $('.expeditionItem').eq(index),
			elemMid = $element.offset().left + $element.width()/2 + margin/2;
			//elem = index + 1;

		if (docSwiperDiff < 0) {
			offset = $swiper.position().left - (elemMid - docWidth/2);

			if (offset > 0) { offset  = 0 ;}
			if (offset < docSwiperDiff) { offset = docSwiperDiff; }
		}

		var translate = 'translate3d(' + offset + 'px, 0px, 0px)';

		$swiper.css('-webkit-transform', translate);
		$swiper.css('-webkit-transition', 'transform .5s ease-out');
		$swiper.css('-moz-transform', translate);
		$swiper.css('-moz-transition', 'transform .5s ease-out');
		$swiper.css('-transform', translate);
		$swiper.css('-transition', 'transform .5s ease-out');
	}
};

module.exports = InterfaceController;