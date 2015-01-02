//ui-events
module.exports = function(map, ChapterManager, overlays) {
    //UI elements
    var uiToggleStory = $('.story-button'),
        uiBannerMenu = $("#banner-menu"),
        uiMenu = $("#menu"),
        uiMenuItem = $(".menu-item"),
        uiHistoricalMaps = $("#historical-map"),
        uiChart = $("#chart-control"),
        tabs = $("#tabs");


    //
    //event handlers
    //
    uiBannerMenu.click(function() {
        //TODO turn int a variable
        uiMenu.slideToggle(300);
    });

    // map.on('click', function(event) {
    //     console.log("northEast...");
    //     console.log(map.getBounds()._northEast.lat + ", " + map.getBounds()._northEast.lng);
    //     console.log(map.getBounds()._southWest.lat + ", " + map.getBounds()._southWest.lng);
    //     console.log(event.latlng.lat + ", " + event.latlng.lng);
    // });

    uiMenuItem.click(function(event) {
        // console.log(this.id);
        ChapterManager.changeChapter(this.id);
        //TODO: menu in a variable
        uiMenu.slideToggle(300);
    });

	$('#opening-close').click(function() {
		var that = $(this).parent();
		// that.anima3d({
		// 	opacity: 0
		// }, 500, 'linear', {complete:
		// 	function () {
		// 		$("#title").fadeIn();
		// 		$("#menu-content").fadeIn();
		// 		$("#banner").fadeIn();
		// 		changeChapter("hoofdstuk 1");
		// 		$("#video").remove();
		// 		that.remove();
		// 	}
		// });

        that.hide("slow", function () {
            $("#title").fadeIn();
            $("#menu-content").fadeIn();
            $("#banner").fadeIn();
            ChapterManager.changeChapter("hoofdstuk 1");
            $("#video").remove();
            that.remove();
        });
	});

	uiToggleStory.click(toggleStory);
    $("#readmore-control").click(toggleStory);

    uiHistoricalMaps.click(function () {
        console.log("alerting");
        //TODO create a decent toggler function

        $.each(overlays, function(index, layer) {
            if (map.hasLayer(layer)) {
                map.removeLayer(layer);
            } else {
                layer.addTo(map);
                //layer.bringToBack();
                layer.setZIndex(1);
            }
        });
    });

    uiChart.click(function() {
        $("#chart").fadeToggle(300);
    });

    tabs.tabs();

};

function toggleStory() {
    var story = $('#story');
    var storyHeight = story.height();
    var height;

    if (storyHeight === 0) {
        height = "100%";
        // $("#title-content").fadeOut();
    } else {
        height = "0%";
        // $("#title-content").fadeIn();
    }

    // story.anima3d({
    //     height: height
    // }, 500, 'linear');
    story.animate({height: height});
}