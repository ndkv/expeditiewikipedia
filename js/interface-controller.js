//TODO remove expedition controller from here and create an event creation
//function
var InterfaceController = function(ExpeditionController) {
	var expeditions = ExpeditionController.expeditions,
		previewItems = [],
		that = this,
		detailedViewDirect = false,
		detailedView = false,
		currentPreviewItem, 
		swiper,
		mode = "landing";

	var attachFastClick = require("fastclick");
	attachFastClick(document.body);
	
	var contentSwiper = new Swiper('#contentSwiper', {
			mode: 'horizontal',
			//scrollContainer: true,
			slidesPerView: 1
		});
	
	var $contentSwiper = $("#contentSwiper");
	var $previewSwiper = $("#previewSwiper");


    var $previewList = $('#previewList');
  
	$(document)
		.on('click', '#toggleTopDrawer', function(e) {
			e.preventDefault();
			$('.detailedDrawer').toggleClass('active');
		})
		.on('click', '#btnStartExpedition', function(e) {
			ExpeditionController.startExpedition(currentPreviewItem);
		})
		.on('click', '#btnBack', function(e) { that.toggleDetailView(); });

    this.toggleDetailView = function() {    	
    	//display different data based on currently selected 

    	$contentSwiper.toggleClass('active');
    	// $previewList.toggleClass('disabled');
    	$(".detailedDrawer").toggleClass('high');
    	// $("#previewSwiper").toggleClass('hidden');
    	$previewSwiper.toggleClass('hidden');
    };

    // this.toggleDetailViewDirect = function(input) {
    // 	$previewList.toggleClass('hidden');
    // 	$(".detailedDrawer").toggleClass('active');
    // 	$(".detailedDrawer").toggleClass('high');
    // 	$detailList.toggleClass('activeDirect');
    // 	detailedViewDirect = true;
    // };
    
	this.togglePreviewItem = function(index) {
		if (currentPreviewItem !== undefined) {
			previewItems[currentPreviewItem].removeClass("previewItemActive");
		}

		currentPreviewItem = index;
		previewItems[index].addClass("previewItemActive");
	};

	this.registerMapEventsRoute = function() {
		$.each(previewItems, function(index, item) {
			var $el = item.children().first();

			$el.click(function() {
				that.togglePreviewItem(index);
				$el.trigger({
					type: 'mapZoomToRoute',
					vmIndex: index
				});			
			});


		});
	};

	this.registerMapEventsPois = function() {
		$.each(previewItems, function(index, item) {
			var $el = item.children().first();

			$el.click(function(e) {
				e.preventDefault();
				that.togglePreviewItem(index);
				$el.trigger({
					type: 'mapZoomToPoI',
					vmIndex: index
				});			
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
			scrollContainer: true
			//slidesPerView: 1
		});
	};

	this.buildLandingView = function() {
		mode = "landing";
		var $previewListContent = $('<div id="previewListContent"></div>');
		//TODO pass expeditions as a variable
		var width = (expeditions.length * 180) + 4*20;
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

			// var $expeditionSummary = $('<div class="expeditionPreviewSummary"></div>');
			// $expeditionSummary.html(value.summary);
			// $expeditionSummary.appendTo($expeditionContent);

			var $readMore = $('<div class="readMore"><a href="#">Lees meer</a></div>');
			$readMore.appendTo($expeditionItem);
			
			$readMore.click(function () {
				currentPreviewItem = index;
				that.toggleDetailView();
			});

			// $('.swiper-slide').width(width);
			// $expeditionItem.appendTo($('.swiper-slide'));
			$('#previewSwiper .swiper-slide').width(width);
			$expeditionItem.appendTo($('#previewSwiper .swiper-slide'));
		});

		buildSwiper();

	};

	this.destroyLandingView = function() {
		//console.log("destroy LandingView");
		swiper.destroy();
		$('#previewSwiper .swiper-wrapper').empty();		//cleans event listeners too
		//$('swiper-slide').empty();		//cleans event listeners too
		$('<div class="swiper-slide"></div>').appendTo($('#previewSwiper .swiper-wrapper')); //
		that.toggleDetailView();
		previewItems = [];
	};

	this.buildExpeditionView = function(expedition, pois) {
		//read expedition texts and place them on interface
		mode = "expedition";

		buildPoIList(pois);
		//build toolbar on bottom

		//hide and show interface elements
		$('#btnStartExpedition').css('display', 'none');
	};

	var buildPoIList = function (pois) {
		var $previewListContent = $('<div id="previewListContent"></div>');
		var $swiperSlide = $('#previewSwiper .swiper-slide');

		var sortable = [];
		$.each(pois, function(index, poi) {
			sortable.push([poi[0].order, poi[0].title, poi[0].summary]);	
		});
		sortable.sort(function(a, b) { return a[0] - b[0]; });

		$.each(sortable, function(index, value) {
			var $expeditionContent = $('<div></div>')
			.append($('<div class="expeditionPreviewTitle"></div>').html(value[1]))
			.append($('<div class="expeditionPreviewSummary"></div>').html(value[2]));

			var $readMore = $('<div class="readMore"><a href="#">Lees meer</a></div>');			
			$readMore.click(function () {
				currentPreviewItem = index;
				that.toggleDetailView();
			});

			var $expeditionItem = $('<div class="expeditionItem"></div>')
			.append($expeditionContent)
			.append($readMore);

			previewItems.push($expeditionItem);

			$swiperSlide.append($expeditionItem);
		});

		var margin = 20;
		var width = (pois.length * 160) + pois.length * margin * 2;
		$swiperSlide.width(width);
		$previewListContent.width(width);

		buildSwiper();
	};


	$("body").bind("_toggleDetailedView", that.toggleDetailView);
};

module.exports = InterfaceController;