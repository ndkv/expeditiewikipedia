$ = require('jquery-browserify');
jQuery = $;
require('./lib/jquery.fancybox.pack.js');
require('./lib/jquery-ui.js');
//require('./lib/minimit-anima.js');
//require('../node_modules/highcharts-browserify/highcharts.js');
require('highcharts-browserify');

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

function setupMap() {

    var map = new L.Map('map', {zoomControl: true, zoomAnimation: true, touchZoom: false});
    map.setView([0.0, 55.0], 3);

    //
    //maps
    //

    // var osm = L.tileLayer.provider('OpenStreetMap.BlackAndWhite');
    var osm = L.tileLayer("https://{s}.tiles.mapbox.com/v2/simeon.ifbdh3of/{z}/{x}/{y}.png");
    //var osm = "";
    //var osm = L.tileLayer("http://188.226.136.81/mapproxy/tiles/vm-mapbox-basemap_EPSG3857/{z}/{x}/{y}.png");

    var wms_url = "http://188.226.136.81:80/mapproxy/service/";

    // var osm = L.tileLayer.wms(wms_url, {
    //     layers: 'vm-mapbox-basemap',
    //     format: 'image/png',
    //     transparent: true,
    //     opacity: opacity,
    //     tiled: true
    // });

    // var sat = L.tileLayer.provider('Esri.WorldImagery');
    //var sat = L.tileLayer("https://{s}.tiles.mapbox.com/v2/simeon.ifbfma7f/{z}/{x}/{y}.png");
    osm.addTo(map);

    var opacity = 1.0;

    var historical_map2 = L.tileLayer.wms(wms_url, {
        layers: 'indian',
        format: 'image/png',
        transparent: true,
        opacity: opacity
    });
    // historical_map2.addTo(map);
    // historical_map2.bringToBack();

    var historical_map = L.tileLayer.wms(wms_url, {
        layers: 'vening_light',
        format: 'image/png',
        transparent: true,
        opacity: opacity
    });
    // historical_map.addTo(map);
 //    historical_map.bringToFront();

    var route = L.tileLayer.wms(wms_url, {
        layers: 'vm-route',
        format: 'image/png',
        transparent: true,
        opacity: opacity
    });
    route.addTo(map);
    route.bringToFront();
    route.setZIndex(2);

    var snip = L.tileLayer.wms(wms_url, {
        layers: 'vening-snip',
        format: 'image/png',
        transparent: true,
        opacity: opacity
    });
    //snip.addTo(map);

    var base_layers = {"Achtergrondkaart": osm};//, "Luchtfoto": sat};
    var overlays = {
        "Atlantische en Indische Oceaan": historical_map2,
        "Atlantische Oceaan": historical_map,
        //"De Snip + platen": snip,
        //"route": route
    };

    //
    //map controls
    //

    var layerControl = L.control.layers(base_layers, overlays, {collapsed: true, position: 'topleft'});
    //layers.addTo(map);

    return [map, layerControl, overlays];
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

// function loadChart(measurements, map) {

//          var values = measurements.getValues(),
//              dates = measurements.getDates(),
//              geometries = measurements.getGeometries(),
//              data = [],
//              year, time, date;

//         var iconProperties = {
//         //iconUrl: 'http://static.ndkv.nl/vm/images/measure_white.png',
//         iconUrl: 'resources/images/icons/measurements.png',
//         iconSize: [20, 20],
//         opacity: 0.1
//         };
//         var tempMarker;



//         $.each(values, function(index, value) {
//             if (dates[index].length > 10) {
//                 year = dates[index].split(' ')[0].split('-');
//                 time = dates[index].split(' ')[1].split(':');

//                 // var date = dates[index].split('-');
//                 //Substract 1 from month as UTC months start at 0
//                 date = Date.UTC(year[0], year[1]-1, year[2], time[0], time[1]);

//             } else {
//                 year = dates[index].split('-');
//                 date = Date.UTC(year[0], year[1]-1, year[2]);
//             }

//             data.push([date, value]);
//         });


//         $('#chart').highcharts({
//         title: {
//             text: 'Gravity and depth measurements',
//             //x: -20 //center
//         },
//         // subtitle: {
//         //     text: 'Source: WorldClimate.com',
//         //     x: -20
//         // },
//         xAxis: {
//             type: 'datetime'
//         },
//         yAxis: {
//             title: {
//                 text: 'Free air anomaly [mgal]'
//             }
//             // plotLines: [{
//             //     value: 0,
//             //     width: 1,
//             //     color: '#808080'
//             // }]
//         },
//         tooltip: {
//             enabled: true,
//             valueSuffix: ' mgal'
//         },
//         // legend: {
//         //     layout: 'vertical',
//         //     align: 'right',
//         //     verticalAlign: 'middle',
//         //     borderWidth: 0
//         //},
//         plotOptions: {
//             series: {
//                 cursor: 'pointer',
//                 point: {
//                     events: {
//                         mouseOver: function () {
//                             var index = this.index;
//                             var marker = geometries[index];
//                             var latLng = marker.getLatLng()

//                             //for some strange reason updating the iconSize of the existing marker fails
//                             //hence we create a new one and remove it afterwards
//                             tempMarker = L.marker([latLng.lat, latLng.lng], {icon: L.icon(iconProperties)})
//                             tempMarker.addTo(map);
//                         },
//                         mouseOut: function () {
//                             map.removeLayer(tempMarker);
//                         }
//                     }
//                 }
//             }
//         },
//         series: [{
//             name: 'Free air anomaly',
//             data: data
//         }]

//         // should become a list of date / value pairs

//         //  {
//         //     name: 'New York',
//         //     data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
//         // }, {
//         //     name: 'Berlin',
//         //     data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
//         // }, {
//         //     name: 'London',
//         //     data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
//         // }]
//     });
// }

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
	var initMap = setupMap();
    var map = initMap[0],
        layerControl = initMap[1],
        overlays = initMap[2];

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
        chapters[currentChapter].hide();
        chapters[id].show();
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

    //
    //Objects
    //

    //TODO put in requirejs

    function Chapter(chapter) {
        //console.log("creating new chapter");
        //this.pois = new Pois(chapter);
        //var track = new Route(chapter);
        var pois = new Pois(chapter);
        var measurements = new Measurements(chapter);
		var story;

		$.get('data/'+ chapter +'/'+ chapter + '.htm', function(data) {
			//console.log('data/'+ chapter +'/'+ chapter + '.htm');
			story = data;
		});

		this.getStory = function () {
			return story;
		};

        this.hide = function () {
            measurements.hide();
            //track.hide();
            pois.hide();
        };

        this.show = function () {
            measurements.show();
            //track.show();
            pois.show();
        };

        this.getMeasurements = function () {
            return measurements;
        };

    }

    function Route(chapter) {
        //console.log("creating new route...");
        var geom;
        var state = "hidden";
        this.id = chapter;

        $.getJSON('data/'+chapter+'/track.json', function(data) {
           //console.log(data.type);
           geom = L.geoJson(data, {
               style: {
                   "color": "#FFFFFF",
                   "weight": 5,
                   "opacity": 0.65
               }
           });

           //changeState();
        });

        function changeState() {
            if (state === "hidden") {
                //console.log("hiding layer");
                map.removeLayer(geom);
            } else {
                //console.log("showing layer");
                map.addLayer(geom);
            }
        }

        this.hide = function() {
            state = "hidden";
            changeState();
        };

        this.show = function() {
            //console.log("show");
            state = "visible";
            changeState();
        };
    }

    function Measurements(chapter) {
        var icon = "",
            geoms = [],
            dates = [],
            values = [],
            state = "hidden";
        console.log("creating measurements");

        var iconProperties = {
            //iconUrl: 'http://static.ndkv.nl/vm/images/measure_white.png',
            iconUrl: 'dist/images/icons/measurements.png',
            iconSize: [10, 10],
            opacity: 0.1
        };

        $.getJSON('data/'+chapter+'/measurements.json', function(data) {
            $.each(data, function(index, value) {
                var marker = L.marker([value.lat, value.lon], {icon: L.icon(iconProperties)});
                marker.bindLabel(value.date);
                geoms.push(marker);
                dates.push(value.date);
                values.push(value.gravity);

                //changeState();
            });
        });

        this.hide = function() {
            state = "hidden";
            changeState();
        };

        this.show = function() {
            //console.log("show");
            state = "visible";
            changeState();

        };

        function changeState() {
            if (state === "hidden") {
                //console.log("hiding layer");
                $.each(geoms, function(index, value) {
                    map.removeLayer(value);
                });
            } else {
                //console.log("showing layer");
                $.each(geoms, function(index, value) {
                    map.addLayer(value);
                });
            }
        }

        this.getGeometries = function() {
            return geoms;
        };

        this.getDates = function () {
            return dates;
        };

        this.getValues = function () {
            return values;
        };
    }

    function Pois(chapter) {
        var geoms = [];
        var state = "hidden";
        var markersCluster = new L.MarkerClusterGroup();

        //console.log("firing Poi get");
        $.getJSON('data/'+chapter+'/pois/pois.json', function(data) {
            $.each(data, function(index, value) {
                var lon = value.lon;
                var lat = value.lat;
                var content = value.content;
                var icon = value.icon;

                $.get('data/'+chapter+'/pois/'+content+'.html', function(html) {
                    //add CSS centering code
                    //var marker = L.marker([lat, lon], {icon: L.icon({iconUrl: 'resources/images/icons/' + icon + '.png', iconSize: [40, 20]})}).bindPopup(html, {maxWidth: 450});
                    var test = $.parseHTML(html);
                    var marker;
                    
                    //TODO: photos don't need html hence should be out of the .get function
                    if (icon == "photo") {
                        marker = L.marker([lat, lon], {icon: L.icon({iconUrl: 'dist/images/icons/' + icon + '.png', iconSize: [30, 30]})});
                        marker.on('click', function() {
                            $.fancybox.open([
                                {
                                    href: 'data/'+ chapter +'/pois/images/'+ content.slice(6) + '.png'
                                }],
                                {   
                                    autoSize: true,
                                    closeClick: true,
                                    autoResize: true,
                                    helpers: {
                                        overlay: {
                                            css: {
                                                'background': 'rgba(0, 0, 0, 0.85)',
                                                'z-index': '1001'
                                            }
                                    }
                                }
                                });
                        }); 
                    } else {
                        marker = L.marker([lat, lon], {icon: L.icon({iconUrl: 'dist/images/icons/' + icon + '.png', iconSize: [30, 30]})}).bindPopup(html, {maxWidth: 450});
//                    geoms.push(marker);
                    }
                    markersCluster.addLayer(marker);
                });
            });
        });

        this.hide = function() {
            state = "hidden";
            changeState();
        };

        this.show = function() {
            //console.log("show");
            state = "visible";
            changeState();
        };

        function changeState() {
            if (state === "hidden") {
                //console.log("hiding layer");
                map.removeLayer(markersCluster);
                // $.each(geoms, function(index, value) {
                //    map.removeLayer(value);
                // });
            } else {
                //console.log("showing layer");
                map.addLayer(markersCluster);
                // $.each(geoms, function(index, value) {
                //    map.addLayer(value);
                // });
            }
        }
    }
};