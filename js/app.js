//GLOBAL!!
$ = require('jquery-browserify');
jQuery = $;
require('./lib/jquery.fancybox.pack.js');
require('./lib/jquery-ui.js');
//require('highcharts-browserify');

//GLOBAL!!
L = require('leaflet');
require('./lib/leaflet-providers.js');
require('./lib/leaflet-label.js');
require('./lib/leaflet.markercluster.js');

function setFancybox() {
    $(".fancybox").fancybox({
        helpers: {
            overlay: {
                css: {
                    'background': 'rgba(0, 0, 0, 0.95)',
                    'z-index': '1001'
                }
            }
        }
    });

    $(".various").fancybox({
        maxWidth    : 708,
        maxHeight   : 482,
        fitToView   : false,
        // width       : '70%',
        // height      : '70%',
        autoSize    : true,
        closeClick  : false,
        openEffect  : 'none',
        closeEffect : 'none',
        helpers: {
            overlay: {
                css : { 'background': 'rgba(0, 0, 0, 0.70)',
                        'z-index': '1001'
                      }
                }
        }
    }); 
}

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

window.onload = function () {

    var loadChart = require('./charts.js');

    var chapters = {},              //holds individual Chapter objects
        currentChapter = "hoofdstuk 1";    //currentChapterly selected chapter

    //UI elements
    var uiToggleStory = $('.story-button'),
        uiBannerMenu = $("#banner-menu"),
        uiMenu = $("#menu"),
        uiMenuItem = $(".menu-item"),
        uiHistoricalMaps = $("#historical-map"),
        uiChart = $("#chart-control"),
        tabs = $("#tabs");

 
    setFancybox();
    
    //initialize map
	//var initMap = setupMap();
    var initMap = require('./map.js');
    var map = initMap.map,
        layerControl = initMap.layerControl,
        overlays = initMap.overlays;

    //TODO remove this! Hack for chapter 3
    var wms_url = "http://188.226.136.81:80/mapproxy/service/";
    var snip = L.tileLayer.wms(wms_url, {
        layers: 'vening-snip',
        format: 'image/png',
        transparent: true,
        opacity: 1
    });

    //
    //event handlers
    //
    uiBannerMenu.click(function() {
        //TODO turn int a variable
        uiMenu.slideToggle(300);
    });

    map.on('click', function(event) {
        console.log("northEast...");
        console.log(map.getBounds()._northEast.lat + ", " + map.getBounds()._northEast.lng);
        console.log(map.getBounds()._southWest.lat + ", " + map.getBounds()._southWest.lng);
        console.log(event.latlng.lat + ", " + event.latlng.lng);
    });

    uiMenuItem.click(function(event) {
        // console.log(this.id);
        changeChapter(this.id);
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
            changeChapter("hoofdstuk 1");
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

    //
    // CONTENT
    //
    //load and setup chapters
    var Chapter = require('./chapter.js');
    $.getJSON("config.json", function (data) {
        console.log("getting config.json");

        $.each(data.chapters, function(index, value) {
            console.log(value);
            chapters[value] = new Chapter(value);
        });
    });

    //
    // Objects
    //
    function changeChapter(id) {
        //load data
        //display data
        //recenter map

        //bboxes of chapter views, activated on click in left menu
        //TODO: remove unecessary precision
        var zoom_coordinates = {
            "hoofdstuk 1": {northEast: L.latLng(54.29088164657006, 21.26953125), southWest: L.latLng(31.203404950917395, -27.3779296875) },
            "hoofdstuk 2": {northEast: L.latLng(35.06597313798418, 4.6142578125), southWest: L.latLng(19.932041306115536, -42.7587890625) },
            "hoofdstuk 3": {northEast: L.latLng(15.855673509998681, -13.798828125), southWest: L.latLng(7.471410908357826, -37.4853515625) },
            "k18": {northEast: L.latLng(51.916479358958874, 4.5406150817871085), southWest: L.latLng(51.89021285195025, 4.442424774169922) }
        };


        //description text in right panel
        //TODO put these in the config file
        // AND use to construct menu also
        var intro_story = {
            "hoofdstuk 1": "Intro text hoofdstuk 1 Intro text hoofdstuk 1 Intro text hoofdstuk 1",
            "hoofdstuk 2": "Intro text hoofdstuk 2",
            "hoofdstuk 3": "Intro text hoofdstuk 3",
            "k18": "Intro hoofdstuk 4"
        };

		var banner_title = {
			"hoofdstuk 1": "Hoofdstuk 1 <br /> Vertrek",
			"hoofdstuk 2": "Hoofdstuk 2 <br /> Vulkanisme",
			"hoofdstuk 3": "Hoofdstuk 3 <br /> Plaattektoniek",
            "k18": "K XVIII <br /> De Onderzeeboot"
		};

        var zoomTo = zoom_coordinates[id];
        map.fitBounds(L.latLngBounds(zoomTo.southWest, zoomTo.northEast), {animate: true, pan: {duration: 1.0}});
        chapters[currentChapter].hide(map);
        chapters[id].show(map);
        currentChapter = id;

        //extra assets
        //TODO should be located in a chapter's definition
        // HACK


        // if (currentChapter == "hoofdstuk 3") {
        //     layers.addOverlay(snip);
        //     snip.addTo(map);
        // } else {
        //     layers.removeLayer(snip);
        //     map.removeLayer(snip);
        // }

        //load content into interface
        $("#blurb").html(intro_story[id]);
		$("#banner-chapter").html(banner_title[id]);
        $('#geschiedenis-content').html(chapters[currentChapter].getStory());
        //$('#wetenschap-content').html(chapters[currentChapter].getStory());

        //initialize and load the chapter's chart
        loadChart(chapters[currentChapter].getMeasurements(), map);
    }   
};