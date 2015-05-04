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

	//load modules
	var wikiUtils = require('./wiki-utils.js');
		
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
			slidesPerView: 1,
			preventLinksPropagation: true,
			preventLinks: true,
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
		swiper = new Swiper('#previewSwiper', {
			mode: 'horizontal',
			scrollContainer: true,
			preventClicks: true
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
		if (currentPreviewItem !== undefined) {
			previewItems[currentPreviewItem].removeClass("previewItemActive");
		}

		currentPreviewItem = index;
		previewItems[index].addClass("previewItemActive");

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
	// binds menu items in landing view to map events

		$.each(previewItems, function(index, item) {
			var $el = item; //.children().first();

			$el.click(function() {
				//check if user is not dragging menu
				if (swiperStill()) {
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
	// binds menu items in expedition view to map events
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
				setTimeout(function() { loadIntroTexts(); }, 500);
			});

			// $('.swiper-slide').width(width);
			// $expeditionItem.appendTo($('.swiper-slide'));
			$('#previewSwiper .swiper-slide').width(width);
			// $expeditionItem.appendTo($('#previewSwiper .swiper-slide'));
			$container.appendTo($('#previewSwiper .swiper-slide'));

			if (value.image !== "") {
				var imageUrl = wikiUtils.fetchWikiImage(value.image, 100, function(imageUrl) { $expeditionItem.css('background-image', "url('" + imageUrl + "')"); }, currentExpedition);
			}
		});

		buildSwiper();
	};

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

		poisList = buildPoiList(pois, previewItems, currentExpedition, toggleDetailView, contentSwiper);
		buildSwiper();
		buildMapsList(mode, expeditions[currentExpeditionIndex].maps);

		//change interface language
		//hack, fix
		if (currentExpedition === 'vening-meinesz') {
			
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

		if (currentExpedition === 'vening-meinesz') {
			// $('#contentSwiper .swiper-slide').css('height', 440);
			// $('#contentSwiper .swiper-slide').css('overflow', 'auto');

			$('.content-control').addClass('active');
			var loadVMExpedition = require('./load-vm-expedition');
			// setTimeout(loadVMExpedition(0, post), 1000);
			loadVMExpedition(0, poisList, contentSwiper);
			// $('#menuColofon').after($('<li class="menu-item" id="menuAcknowledgments">Acknowledgments</li>'));

			currentLanguage = changeInterfaceLanguage('EN');
		}

		if (currentLanguage === 'EN') { $('#overview a').html('&#8592; Expeditions'); }
	};

	var buildPoiList = require('./build-poi-list');

	var buildMapsList = require('./build-maps-list');
	

	// var appendImageToPoI = function(imageUrl) {
	// 	// $('.expedition-text-image').append('<img src="' +  imageUrl +'"">');
	// };

	var swiperStill = function() {
		var touches = swiper.touches;
		return touches.start === touches.current;
	};

	var changeInterfaceLanguage = require('./change-interface-language');

	var loadIntroTexts = function() {
		contentSwiper.removeAllSlides();
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
		var moveDirection = (direction === 'right') ? -300 : 300,
			$swiper = $('#previewSwiper > div.swiper-wrapper'),
			spacerRightWidth = 100,
			spacerLeftWidth = 150,
			docWidth = $(document).width(),
			docSwiperDiff = docWidth - $swiper.width() - spacerRightWidth,
			swiperPosition = $swiper.position().left,
			move = swiperPosition + moveDirection;

		if (docSwiperDiff < 0) {
			var rightEdge = swiperPosition + $swiper.width();

			if (rightEdge + moveDirection < docWidth - spacerRightWidth) {
				move = swiperPosition + (docWidth - rightEdge) - spacerRightWidth - spacerLeftWidth;
			}			
		} else {
			move = 0;
		}

		if (swiperPosition + moveDirection > 0) { move = 0; }

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
			})
			.on('click', '.menu-item', function() {
				el = this.id + currentLanguage;

				$.fancybox.open($('#'+el), {
					maxWidth: 600,
					type: 'inline'
				});
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

			currentLanguage = changeInterfaceLanguage(lang);
			loadIntroTexts();

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