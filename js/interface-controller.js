//TODO remove expedition controller from here and create an event creation
//function
var InterfaceController = function(ExpeditionController) {
	var expeditions = ExpeditionController.expeditions,
		previewItems = [],
		that = this,
		detailedViewDirect = false,
		detailedView = false,
		currentPreviewItem, swiper;

	var attachFastClick = require("fastclick");
	attachFastClick(document.body);
	
	var $detailList = $('#detailList');
    var detailList = new Dragend($detailList[0], {
    	afterInitialize: function() {
        	$detailList.style.visibility = 'visible';
       	}
    });

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

    	$detailList.toggleClass('active');
    	$previewList.toggleClass('disabled');
    	$(".detailedDrawer").toggleClass('high');
    	$(".swiper-container").toggleClass('hidden');
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

	this.registerMapEvents = function() {
		$.each(previewItems, function(index, item) {
			var $el = item.children().first();

			$el.click(function() {
				that.togglePreviewItem(index);
				$el.trigger({
					type: 'mapZoomTo',
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
		swiper = new Swiper('.swiper-container', {
			mode: 'horizontal',
			scrollContainer: true
			//slidesPerView: 5
		});
	};

	this.buildLandingView = function() {
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

			var $expeditionSummary = $('<div class="expeditionPreviewSummary"></div>');
			$expeditionSummary.html(value.summary);
			$expeditionSummary.appendTo($expeditionContent);

			var $readMore = $('<div class="readMore"><a href="#">Lees meer</a></div>');
			$readMore.appendTo($expeditionItem);
			
			$readMore.click(function () {
				currentPreviewItem = index;
				that.toggleDetailView();
			});

			$('.swiper-slide').width(width);
			$expeditionItem.appendTo($('.swiper-slide'));
		});

		buildSwiper();

	};

	this.destroyLandingView = function() {
		//console.log("destroy LandingView");
		swiper.destroy();
		$('.swiper-wrapper').empty();		//cleans event listeners too
		//$('swiper-slide').empty();		//cleans event listeners too
		$('<div class="swiper-slide"></div>').appendTo($('.swiper-wrapper')); //
		that.toggleDetailView();
	};

	this.buildExpeditionView = function(expedition, pois) {
		//read expedition texts and place them on interface

		buildPoIList(pois);
		//build toolbar on bottom
	};

	var buildPoIList = function (pois) {
		var $previewListContent = $('<div id="previewListContent"></div>');
		var width = (pois.length * 180) + 2*pois.length*20;
		$previewListContent.width(width);
		//previewListContent.appendTo(previewList);

		var sortable = [];
		$.each(pois, function(index, poi) {
			sortable.push([poi.order, poi.title, poi.summary]);	
		});

		sortable.sort(function(a, b) { return a[0] - b[0]; });

		$.each(sortable, function(index, value) {
			var $expeditionItem = $('<div class="expeditionItem"></div>');
			previewItems.push($expeditionItem);

			var $expeditionContent = $('<div></div>');
			$expeditionContent.appendTo($expeditionItem);

			var $expeditionTitle = $('<div class="expeditionPreviewTitle"></div>');
			$expeditionTitle.html(value[1]);
			$expeditionTitle.appendTo($expeditionContent);

			var $expeditionSummary = $('<div class="expeditionPreviewSummary"></div>');
			$expeditionSummary.html(value[2]);
			$expeditionSummary.appendTo($expeditionContent);

			var $readMore = $('<div class="readMore"><a href="#">Lees meer</a></div>');
			$readMore.appendTo($expeditionItem);
			
			$readMore.click(function () {
				currentPreviewItem = index;
				that.toggleDetailView();
			});

			$('.swiper-slide').width(width);
			$expeditionItem.appendTo($('.swiper-slide'));
		});

		buildSwiper();

		//load PoIs
		//add them to DOM
		//buildSwiper
	};

    //can be removed once dragend is out
    var overscroll = function(el) {
    	el.addEventListener('touchstart', function() {
    		var top = el.scrollTop,
	    	totalScroll = el.scrollHeight,
	    	currentScroll = top + el.offsetHeight;
	    	//If we're at the top or the bottom of the containers
	    	//scroll, push up or down one pixel.
		    //
		    //this prevents the scroll from "passing through" to
		    //the body.
		    
		    if(top === 0) {
		      el.scrollTop = 1;
		    } else if(currentScroll === totalScroll) {
		      el.scrollTop = top - 1;
		    }
		});
  
		el.addEventListener('touchmove', function(evt) {
			//if the content is actually scrollable, i.e. the content is long enough
			//that scrolling can occur
			
			if(el.offsetHeight < el.scrollHeight)
		      evt._isScroller = true;
		});
	};

	overscroll(document.querySelector('.dragend-page'));
		
	document.body.addEventListener('touchmove', function(evt) {
	  //In this case, the default behavior is scrolling the body, which
	  //would result in an overflow.  Since we don't want that, we preventDefault.
	  if(!evt._isScroller) {
	    evt.preventDefault();
	  }
	});

	$("body").bind("_toggleDetailedView", that.toggleDetailView);
};

module.exports = InterfaceController;