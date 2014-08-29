window.onload = function () {
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

	var sat = L.tileLayer.provider('Esri.WorldImagery');
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

    var snip = L.tileLayer.wms(wms_url, {
		layers: 'vening-snip',
		format: 'image/png',
		transparent: true,
		opacity: opacity
	});
    //snip.addTo(map);

	var base_layers = {"Achtergrondkaart": osm, "Luchtfoto": sat};
	var overlays = {
        "Atlantische en Indische Oceaan": historical_map2,
        "Atlantische Oceaan": historical_map,
        //"De Snip + platen": snip,
        "route": route
	};

    //
    //map controls
    //

	var layers = L.control.layers(base_layers, overlays, {collapsed: true, position: 'topleft'});
	layers.addTo(map);

    //
    //event handlers
    //

    $('#banner-menu').click(function() {
        //TODO turn int a variable
        $('#menu').slideToggle(300);
    })

    map.on('click', function(event) {
        console.log("northEas...");
        console.log(map.getBounds()._northEast.lat + ", " + map.getBounds()._northEast.lng);
        console.log(map.getBounds()._southWest.lat + ", " + map.getBounds()._southWest.lng);
        console.log(event.latlng.lat + ", " + event.latlng.lng);
    });

    $(".menu-item").click(function(event) {
        // console.log(this.id);
        changeChapter(this.id);
        //TODO: menu in a variable
        $('#menu').slideToggle(300);
    });


	$('#opening-close').click(function() {
		var that = $(this).parent();
		that.anima3d({
			opacity: 0
		}, 500, 'linear', {complete:
			function () {
				$("#title").fadeIn();
				$("#menu-content").fadeIn();
				$("#banner").fadeIn();
				changeChapter("hoofdstuk 1");
				$("#video").remove();
				that.remove();
			}
		});
	});


	var hud = true;
    $('.close').click(function() {

		if (hud) {
			$(this).next().fadeIn();
			$(this).text("i");
		} else {
			$(this).next().fadeOut();
			$(this).text("X");
		}

		closeX();

	});



    function closeX() {
        //console.log("testing");
        //$(this).data('clicked',!$(this).data('clicked'));

        // if ($(this).data('clicked'))
		if (hud)
            {
                $("#title-content").fadeOut();
                $("#menu-content").fadeOut();
				hud = false;
            }
        else
            {
                //hack
                $("#title-content").fadeIn();
                $("#menu-content").fadeIn();
				hud = true;
            }
    }


	//var story = String("test");
	var storyOpen = false;

	$('.story-button').click(function() {
		//console.log("acting");
		//$('#story').css("display", "block");

		$('#story-content').html(chapters[current].getStory());
		//$('#story').slideToggle();

		var height;
		if (storyOpen) {
			height = "0%";
		} else {
			height = "100%";
		};

		storyOpen = !storyOpen;

		$('#story').anima3d({
			height: height
		}, 500, 'linear');

		closeX();
		$('#close-title').fadeToggle();
	});


    //
    // CONTENT
    //
    //load and setup chapters
    var chapters = {};
    var current = "hoofdstuk 1";


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
        var zoom_coordinates = {
            "hoofdstuk 1": {northEast: L.latLng(54.29088164657006, 21.26953125), southWest: L.latLng(31.203404950917395, -27.3779296875) },
            "hoofdstuk 2": {northEast: L.latLng(35.06597313798418, 4.6142578125), southWest: L.latLng(19.932041306115536, -42.7587890625) },
            "hoofdstuk 3": {northEast: L.latLng(15.855673509998681, -13.798828125), southWest: L.latLng(7.471410908357826, -37.4853515625) },
            "k18": {northEast: L.latLng(51.916479358958874, 4.5406150817871085), southWest: L.latLng(51.89021285195025, 4.442424774169922) }
        };


        //description text in right panel
        //TODO put these in the config file
        var intro_story = {
            "hoofdstuk 1": "Intro text hoofdstuk 1 Intro text hoofdstuk 1 Intro text hoofdstuk 1",
            "hoofdstuk 2": "Intro text hoofdstuk 2",
            "hoofdstuk 3": "Intro text hoofdstuk 3",
            "k18": "Intro tekst K18"
        };

		var banner_title = {
			"hoofdstuk 1": "Hoofdstuk 1 <br /> Vertrek",
			"hoofdstuk 2": "Hoofdstuk 2 <br /> Vulkanisme",
			"hoofdstuk 3": "Hoofdstuk 3 <br /> Plaattektoniek",
            "k18": "K XVIII <br /> De Onderzeeboot"
		}

        var zoomTo = zoom_coordinates[id];
        map.fitBounds(L.latLngBounds(zoomTo.southWest, zoomTo.northEast), {animate: true, pan: {duration: 1.0}});
        chapters[current].hide();
        chapters[id].show();
        current = id;

        //console.log(chapter)
        //extra assets
        //TODO should be located in a chapter's definition
        if (current == "hoofdstuk 3") {
            layers.addOverlay(snip);
            snip.addTo(map);
        } else {
            layers.removeLayer(snip);
            map.removeLayer(snip);
        }

        $("#blurb").html(intro_story[id]);
		$("#banner-chapter").html(banner_title[id]);
    }

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
		})

		this.getStory = function () {
			return story;
		}

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
        console.log("creating measurements");
        var icon = "";
        var geoms = [];
        var state = "hidden";

        var icon_properties = {
            //iconUrl: 'http://static.ndkv.nl/vm/images/measure_white.png',
            iconUrl: 'resources/images/icons/measurements.png',
            iconSize: [10, 10],
            opacity: 0.1
        };

        $.getJSON('data/'+chapter+'/measurements.json', function(data) {
            $.each(data, function(index, value) {
                var marker = L.marker([value.lat, value.lon], {icon: L.icon(icon_properties)});
                marker.bindLabel(value.date);
                geoms.push(marker);
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
                    
                    //TODO: photos don't need html hence should be out of the .get function
                    if (icon == "photo") {
                        var marker = L.marker([lat, lon], {icon: L.icon({iconUrl: 'resources/images/icons/' + icon + '.png', iconSize: [30, 30]})});
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
                        var marker = L.marker([lat, lon], {icon: L.icon({iconUrl: 'resources/images/icons/' + icon + '.png', iconSize: [30, 30]})}).bindPopup(html, {maxWidth: 450});
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
