
var InterfaceController = function(ExpeditionController) {
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
	    uiToggleTopDrawer = $("#toggleTopDrawer"),
		uiToggleDetail = $("#toggleDetail");


	uiToggleTopDrawer.click(function(e){
		console.log("clicked");
      	$('.detailedDrawer').toggleClass('active');
      	e.preventDefault();
    });

    uiToggleDetail.click(function() {
    	$("#detailList").toggleClass('active');
    	$("#previewList").toggleClass('disabled');
    	$(".detailedDrawer").toggleClass('high');
    });

	var listeners = [];

	this.registerMapEvents = function(MapController) {
		$.each(previewItems, function(index, item) {
			var handler = function(MapController) {
				MapController.zoomTo(item.id);
			};

			listeners.append(handler);
			item.on('focus', handler);
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
		// populate previewList with expeditions
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