//TODO remove expedition controller from here and create an event creation
//function
var InterfaceController = function(ExpeditionController) {
	var expeditions = ExpeditionController.expeditions,
		expeditionsHash = {},
		previewItems = [],
		that = this,
		detailedViewDirect = false,
		detailedView = false,
		currentPreviewItem,
		currentPoi,
		currentExpedition,
		swiper,
		mode = "landing",
		poisList;

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

	$.each(ExpeditionController.expeditions, function(index, value) {
		expeditionsHash[value.id] = index;
	});

	var attachFastClick = require("fastclick");
	attachFastClick(document.body);
	
	var contentSwiper = new Swiper('#contentSwiper', {
			mode: 'horizontal',
			//scrollContainer: true,
			slidesPerView: 1
		});
	
	var $contentSwiper = $("#contentSwiper");
	var $previewSwiper = $("#previewSwiper");
	var $swiperMenu = $('#swiperMenu');


    var $previewList = $('#previewList');
  
	$(document)
		.on('click', '#toggleTopDrawer', function(e) {
			// e.preventDefault();
			$('.detailedDrawer').toggleClass('active');
			$swiperMenu.toggleClass('hidden');

			this.text = (this.text === "x") ? "+" : "x";
		})
		.on('click', '#btnStartExpedition', function(e) {
			ExpeditionController.startExpedition(currentPreviewItem);
			window.location.hash = expeditions[currentPreviewItem].id;
		})
		.on('click', '#btnBack', function(e) { that.toggleDetailView(); })
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

		if (hash === '#afbeelding' || hash === '#artikel')
			window.location.hash = currentExpedition;

		console.log(window.history);
	}); 

	$('#btnZoomIn').click(function() { $(document).trigger('_mapZoomIn'); });
	$('#btnZoomOut').click(function() { $(document).trigger('_mapZoomOut'); });


	var $menuContentContainer = $('#menuContentContainer'),
		$menuContainer = $('#menuContainer'),
		$menuContent = $('#menuContent');

	$('#btnMenu').click(function() { 
		$menuContainer.toggleClass('active');
		this.toggleClass('active');
	});


	$('.menu-item').click(function() {
		$menuContainer.toggleClass('active');
		$menuContentContainer.toggleClass('active');
		$menuContent.html(this.innerHTML);
		$('#menuBlackout').addClass('active');
	});

	$('#btnMenuClose').click(function() {
		$menuContentContainer.toggleClass('active');
		$('#menuBlackout').removeClass('active');
	});
		
    this.toggleDetailView = function() {    	
    	$contentSwiper.toggleClass('active');
    	$(".detailedDrawer").toggleClass('high');
    	//hack, fix
    	$('#toggleTopDrawer').toggleClass('hidden');

    	$swiperMenu.toggleClass('hidden');
    };
    
	this.togglePreviewItem = function(index) {
		if (currentPreviewItem !== undefined) {
			previewItems[currentPreviewItem].removeClass("previewItemActive");
		}

		currentPreviewItem = index;
		previewItems[index].addClass("previewItemActive");
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
	};

	this.registerMapEventsRoute = function() {
		$.each(previewItems, function(index, item) {
			var $el = item; //.children().first();

			$el.click(function() {
				if (swiperStill()) {
					that.togglePreviewItem(index);
					$el.trigger({
						type: 'mapZoomToRoute',
					//vmIndex: index
						expeditionId: expeditions[index].id
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

	var populatePreviewList = function() {

	};

	var populateDetailsList = function() {

	};

	this.changeViewingMode = function() {
		//stuff to do when moving from landing page to expedition page
	};

	var emptyTopDrawer = function() {

	};

	this.loadExpedition = function() {
		populatePreviewList();
		populateDetailsList();

	};

	//
	//VIEWING MODE
	// 

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
		//TODO pass expeditions as a variable

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

			var $readMore = $('<div class="readMore"><span>Lees meer</span></div>');
			// $readMore.appendTo($expeditionItem);

			var $container = $('<div class="expeditionItemContainer"></div>');
			$container.append($expeditionItem);
			$container.append($readMore);
			
			$readMore.click(function () {
				currentPreviewItem = index;
				that.loadContent();
				that.toggleDetailView();
				console.log(swiper.progress);
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

		$('.spacer-left-title').html('kies een reis');
		$('.spacer-left-summary').html('stap in en doe mee met de interessante expedities en ontdek alles over geschiedenis en techniek en leer wat wetenschap zo rijk maakt!');

		buildSwiper();
	};

	this.loadContent = function() {
		contentSwiper.removeAllSlides();
		if (mode == 'landing') {
			var expedition = expeditions[currentPreviewItem];
			fetchWikiExcerpt(expedition.link, expedition.words, false);
		} else {
			if (currentExpedition === "vening meinesz") {
				loadVMExpedition();
			} else {
				var wikiUrl = poisList[currentPoi - 1][1]['Wikipedia link'];
				if (wikiUrl.length > 0) {
					fetchWikiExcerpt(wikiUrl, 20000, true);
				}
			}
		}
	};

	this.destroyLandingView = function() {
		//console.log("destroy LandingView");
		swiper.destroy();
		$('#previewSwiper .swiper-wrapper').empty();		//cleans event listeners too
		//$('swiper-slide').empty();		//cleans event listeners too
		$('<div class="swiper-slide"></div>').appendTo($('#previewSwiper .swiper-wrapper')); //
		that.toggleDetailView();

		$('.spacer-left-title').html("");
		$('.spacer-left-summary').html("");

		previewItems = [];
	};

	this.buildExpeditionView = function(maps, expedition, pois) {
		//read expedition texts and place them on interface
		mode = "expedition";
		currentExpedition = expedition;
		var expeditionAttributes = expeditions[expeditionsHash[expedition]];

		$('#btnMapDrawer').toggleClass('active');

		buildPoIList(pois);
		loadMaps(maps);

		//hide and show interface elements
		//TODO toggle visibility through class and translate
		$('#btnStartExpedition').css('display', 'none');

		$('.spacer-left-title').html(expeditionAttributes.title);
		$('.spacer-left-summary').html(expeditionAttributes.summary);
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
				that.loadContent();
			});

			var afbeelding = value[1].Afbeelding;
			//TODO change to type check of POI
			if (afbeelding !== "") {
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
						    		var title = value[1].summary + ' ' + value[1].Datum + ' (' + value[1].Instelling + ')';

									var bigViewUrl = data.query.pages['-1'].imageinfo[0].thumburl;
									$.fancybox.open([{
										href:bigViewUrl , title: title
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
		});

		var margin = 20;
		var width = (pois.length * $('.expeditionItem').width()) + pois.length * margin * 2;
		$swiperSlide.width(width);
		$previewListContent.width(width);

		buildSwiper();
	};

	var loadMaps = function(maps) {
		var $mapList = $('#lstMap');

		try {
			$.each(maps, function(index, value) {
				$mapList.append('<div></div>');

				var $checkbox = $('<input type="checkbox">');
				$checkbox.click(function() {
					$checkbox.trigger('_toggleOverlayVisibility', [index]);
				});

				var label = $('<label></label>')
				.append($checkbox) 
				.append($('<div>' + value + '</div>'))
				.appendTo($mapList.children().last());
			});
		}
		catch (e) {
			$('#btnMapDrawer').css('opacity', 0);
			console.log("Warning, this expedition does not have any maps.");
		}		
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
		var path = 'data/' + currentExpedition + '/pois/' + poi[1].type + ' ' + poi[1].title + '.htm';

		$.get(path, function(data) {
			var columns = $('<div class="columns"></div>');
			var $data = $(data);
			var images = $data.find('img');

			$.each(images, function(index, value) {
				var urlPieces = $(value).prop('src').split('/'),
					folder = urlPieces[urlPieces.length - 2],
					file = urlPieces[urlPieces.length - 1],
					imageUrl = 'data/' + currentExpedition + '/pois/' + folder + '/' + file;

				$image = $(value);
				$image.prop('src', imageUrl);

				var height = $image.prop('height'),
					width = $image.prop('width'),
					ratio = height/width,
					columnWidth = 300;
				
				$image.prop('height', columnWidth * ratio);

				var $fancybox = $('<a class="fancybox" href="' + imageUrl + '"></a>');
				$fancybox.appendTo($image.parent());
				$image.detach().appendTo($fancybox);
			});

			columns.append($data);

			var slide = contentSwiper.createSlide(columns[0].outerHTML);
			slide.append();
		});
	};

	var fetchWikiExcerpt = function(url, numWords, columns) {
		var contentElem = $('<div></div>');
		
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
					

					contentElem.append($(pages[page].extract));

					if (columns) {
						contentElem.addClass('columns');
					} else {
						contentElem.addClass('columns-none');
					}

					var slide = contentSwiper.createSlide(contentElem[0].outerHTML);
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
};



module.exports = InterfaceController;