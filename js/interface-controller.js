
var InterfaceController = function(ExpeditionController) {
	var previewItems = [];
	var that = this;
	var currentPreviewItem;

	var detailedViewDirect = false;
	var detailedView = false;

	var attachFastClick = require("fastclick");
	attachFastClick(document.body);

	var container = $("#detailList")[0];
    var detailList = new Dragend(container, {
    	afterInitialize: function() {
        	container.style.visibility = "visible";
       	}
    });

    //prevent propagation of dragend overscroll to body
    //TODO change to detailList preview

    var previewList = $('#previewList');

    var topDrawer = $('#detailedDrawer');
     
	//register initialevents

	var topDrawerMode; //closed, open, detail
	var changeViewingMode; //landing, expedition

	//CONTROLS
	var uiTopDrawerList,
		uiTopDrawerDetail,
	    uiToggleTopDrawer = $("#toggleTopDrawer");
		// uiToggleDetail = $("#toggleDetail"),
		//uiReadMore = $(".readMore");

	uiToggleTopDrawer.click(function(e){
		console.log("clicked");
      	$('.detailedDrawer').toggleClass('active');
      	//$("#map").toggleClass('preview');
      	e.preventDefault();
    });

    this.openDetailView = function() {
    	console.log("clicked detailView");
    	$("#detailList").toggleClass('active');
    	previewList.toggleClass('disabled');
    	$(".detailedDrawer").toggleClass('high');
    };

    $("#btnBack").click(function () {
    	if (detailedViewDirect) {
    		that.openDetailViewDirect();
    		detailViewDirect = false;
    		console.log('returning from high to low');
    	} else {
			that.openDetailView();
    	}
    });

    this.openDetailViewDirect = function(input) {
    	previewList.toggleClass('hidden');
    	$(".detailedDrawer").toggleClass('active');
    	$(".detailedDrawer").toggleClass('high');
    	$("#detailList").toggleClass('activeDirect');
    	detailedViewDirect = true;
    };
    

	var listeners = [];

	this.togglePreviewItem = function(index) {
		if (currentPreviewItem !== undefined) {
			previewItems[currentPreviewItem].removeClass("previewItemActive");
		}

		currentPreviewItem = index;
		previewItems[index].addClass("previewItemActive");
	};

	this.registerMapEvents = function(MapController) {
		$.each(previewItems, function(index, item) {
			var handler = function() {
				console.log("clicked map event");
				MapController.zoomTo(index);
				that.togglePreviewItem(index);
			};

			listeners.push(handler);
			item.children().first().on('click', handler);
		});
	};

	this.destroyMapEvents = function() {
		$.each(handlers, function(index, item) {
			item.off('focus', handlers.pop(index));
		});
	};

	// this.openDetailView(id) {

	// };

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

	//VIEWING MODE 

	this.buildLandingView = function() {
		var expeditions = ExpeditionController.expeditions;

		var previewListContent = $('<div id="previewListContent"></div>');
		previewListContent.width((expeditions.length * 180) + 4*20);
		previewListContent.appendTo(previewList);

		$.each(expeditions, function(index, value) {
			var expeditionItem = $('<div class="expeditionItem"></div>');
			expeditionItem.appendTo(previewListContent);
			previewItems.push(expeditionItem);

			var expeditionTitle = $('<div class="expeditionPreviewTitle"></div>');
			expeditionTitle.html(value.title);
			expeditionTitle.appendTo(expeditionItem);

			var expeditionSummary = $('<div class="expeditionPreviewSummary"></div>');
			expeditionSummary.html(value.summary);
			expeditionSummary.appendTo(expeditionItem);

			var moreInfo = $('<div class="readMore"><a href="#" id="toggleDetail-'+ index +'">Lees meer</a></div>');
			moreInfo.appendTo(expeditionItem);
			moreInfo.click(that.openDetailView);
		});


		// 	populate DetailLIst with expedition descriptions

	};

	//this.destroyLandingView

	//this.buildExpeditionView(expedition)
	  //  populate previewList with POIs
	  //  populate DetailList with POIs expeditions
	//this.destroyExpeditionView

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
};

module.exports = InterfaceController;