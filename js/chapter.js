module.exports = function (chapter) {
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

        this.hide = function (map) {
            measurements.hide(map);
            //track.hide();
            pois.hide(map);
        };

        this.show = function (map) {
            measurements.show(map);
            //track.show();
            pois.show(map);
        };

        this.getMeasurements = function () {
            return measurements;
        };
};

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

        function changeState(map) {
            if (state === "hidden") {
                //console.log("hiding layer");
                map.removeLayer(geom);
            } else {
                //console.log("showing layer");
                map.addLayer(geom);
            }
        }

        this.hide = function(map) {
            state = "hidden";
            changeState(map);
        };

        this.show = function(map) {
            //console.log("show");
            state = "visible";
            changeState(map);
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

        this.hide = function(map) {
            state = "hidden";
            changeState(map);
        };

        this.show = function(map) {
            //console.log("show");
            state = "visible";
            changeState(map);

        };

        function changeState(map) {
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
                    //var test = $.parseHTML(html);
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

        this.hide = function(map) {
            state = "hidden";
            changeState(map);
        };

        this.show = function(map) {
            //console.log("show");
            state = "visible";
            changeState(map);
        };

        function changeState(map) {
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
