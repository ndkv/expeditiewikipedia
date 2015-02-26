var MapController = function() {
	var features = {},
		poisList = [],
		overlays = [],
		currentExpedition,
		listeners = [],
		basemaps = [];
	
	var map = new L.Map('map', {zoomControl: false, zoomAnimation: true, touchZoom: true});
	map.setView([0.0, 55.0], 3);

	this.registerInterfaceEvents = function(InterfaceController) {
		$.each(features, function(id, feature) {
			var handler = function () {
				InterfaceController.togglePreviewItemLanding(id);
			};

			listeners.push(handler);
			feature.on('click', handler);
		});

		var $swiper = $('.swiper-wrapper'),
			swiperOffset = $swiper.offset().left,
			spacerLeftWidth = $('.spacer-left').width(),
			spacerRightShadow = 30,
			spacerRightWidth = $('.spacer-right').width() + spacerRightShadow,
			margin = 20,
			offset;

		$.each(poisList, function (index, poi) {
			var handler = function () { 
				InterfaceController.togglePreviewItem(index);

				//center menu, should be in won function
				var docWidth = $(document).width(),
					docSwiperDiff = docWidth - $swiper.width() - spacerRightWidth - spacerLeftWidth;

				var	$element = $('.expeditionItem').eq(index),
					elemMid = $element.offset().left + $element.width()/2 + margin/2;
					//elem = index + 1;

				if (docSwiperDiff < 0) {
					offset = $swiper.position().left - (elemMid - docWidth/2);

					if (offset > 0) { offset  = 0 ;}
					if (offset < docSwiperDiff) { offset = docSwiperDiff; }
				}

				var translate = 'translate3d(' + offset + 'px, 0px, 0px)';

				$swiper.css('-webkit-transform', translate);
				$swiper.css('-webkit-transition', 'transform .5s ease-out');
				$swiper.css('-moz-transform', translate);
				$swiper.css('-moz-transition', 'transform .5s ease-out');

			};
	
			listeners.push(handler);
			poi.on('click', handler);
		});
	};

	var destroyFeatures = function() {
		//deregister events? or handle by empty() the linked element?

	};

	//VIEWING MODE 

	this.buildLandingView = function(feats, expeditions) {
		//display one historical map per expedition

		$.each(feats, function(index, value) {
			var geometry = value.geometry.coordinates,
				type = value.geometry.type,
				coordinates = [],
				feature;

			//reverse geojson.io's lat/lng order
			

			if (type === 'LineString') {
				$.each(geometry, function(i, v) {
					coordinates.push([v[1], v[0]]);
				});

				feature = L.polyline(coordinates, {
					weight: 3,
					opacity: 0.9, 
					color: '#d00', 
					dashArray: '10, 5',
					lineCap: 'butt',
					lineJoin: 'round'
				});
			}

			if (type === "Polygon") {
				$.each(geometry[0], function(i, v) {
					coordinates.push([v[1], v[0]]);
				});

				feature = L.polygon(coordinates, {
					weight: 3,
					opacity: 0.9, 
					color: '#d00', 
					dashArray: '10, 5',
					lineCap: 'butt',
					lineJoin: 'round'
				});
			}

			feature.addTo(map);

			features[value.properties.id] = feature;
		});

		// var basemap = L.tileLayer("https://{s}.tiles.mapbox.com/v2/simeon.ifbdh3of/{z}/{x}/{y}.png");
		var basemap = L.tileLayer('data/basemap/{z}/{x}/{y}.png', {
			tms: false
		});

		basemap.addTo(map);
		basemaps.push(basemap);

		$.each(expeditions, function(index, value) {
			loadMaps(value.id, value.maps);
		});
	};

	this.destroyLandingView = function() {
		$.each(features, function(index, feature) {
			//feature.off('click', listeners.pop(index));
			map.removeLayer(feature);
		});
		features = [];

		$.each(overlays, function(index, overlay) {
			map.removeLayer(overlay);
		});
		overlays = [];
		
	};

	this.buildExpeditionView = function(expedition, maps, route, pois) {
		currentExpedition = expedition;
		var basemap = L.tileLayer.provider('Esri.OceanBasemap', {opacity: 0});
		buildExpeditionGeometries(route, pois);
		
		var handler = function() {
			$('.leaflet-tile-pane').css('transition', 'opacity .45s');
			$('.leaflet-layer').css('transition', 'opacity .45s');
			$('.leaflet-tile-container').css('transition', 'opacity .45s');
			basemap.setOpacity(1);
			if (basemaps.length > 0) { basemaps[0].setOpacity(0); }

 	
			setTimeout(function() {
				$('.leaflet-tile-pane').css('transition', '');
				$('.leaflet-layer').css('transition', '');
				$('.leaflet-tile-container').css('transition', '');
				if (basemaps.length > 0) { map.removeLayer(basemaps[0]); }
				basemap.off('load', handler);

				loadMaps(expedition, maps);
			}, 350);
		};

		basemap.on('load', handler);

		basemap.addTo(map);
	};

	var buildExpeditionGeometries = function(route, pois) {
		try {
			var routeGeometry = route.geometry.coordinates
			.map(function(coords) { return [coords[1], coords[0]]; });

			var feature = L.polyline(routeGeometry);
			feature.addTo(map);
			map.fitBounds(feature.getBounds());
			map.zoomOut();
			features.push(feature);
		} catch(err) {
			console.log('warning, failed to construct expedition route.');
		}
		


		//to do: put in a data reading module
		var sortable = [];
		$.each(pois, function(index, poi) {
			sortable.push([poi[0].order, poi[1]]);	
		});
		sortable.sort(function(a, b) { return a[0] - b[0]; });

		sortable.map(function(pois) {
			var icon = new L.Icon.Default();
			icon.options.shadowSize = [0,0];
			var coords = pois[1];
			var marker = L.marker([coords[1], coords[0]], {icon: icon});
			marker.addTo(map);

			poisList.push(marker);
		});
	};

	var loadMaps = function(currentExpedition, maps) {
		var initialMap = overlays.length;
		try {
				var overlay;
				$.each(maps, function(index, value) {
					var latLngBounds;
					try {
						latLngBounds = L.latLngBounds(value.bounds.southWest, value.bounds.northEast);
					}
					catch (err) {
						console.log('Warning, no bounds defined for map ' + value.id);
					}

					var path = 'data/' + currentExpedition + '/maps/' + value.id + '/{z}/{x}/{y}.png';
					overlay = L.tileLayer(path, { 
						tms: true, 
						updateWhenIdle: true,
						bounds: latLngBounds
					});
					overlays.push(overlay);
			});
				overlays[initialMap].addTo(map);
		}
		catch (e) {
			console.log('Warning: failed to fetch map.');
			if (maps === undefined) { console.log('This expedition does not have any maps.'); }
		}
	};
	
	//this.destroyExpeditionView

	var zoomToRoute = function(e) {
		var index = e.expeditionId;
		map.fitBounds(features[index].getBounds());
	};

	var zoomToPoi = function(e) {
		console.log('catchintg zoomToPoi trigger');
		var index = e.vmIndex;
		map.panTo(poisList[index].getLatLng());
	};

	var toggleLayer = function(event, index) {
		var layer = overlays[index];
		if (map.hasLayer(layer)) {
			map.removeLayer(layer);
		} else {
			map.addLayer(layer);
		}
	};

	$(document).bind('mapZoomToRoute', zoomToRoute);
	$(document).bind('mapZoomToPoI', zoomToPoi);
	$(document).bind('_toggleOverlayVisibility', toggleLayer);
	$(document).bind('_mapZoomIn', function() { map.zoomIn(); });
	$(document).bind('_mapZoomOut', function() { map.zoomOut(); });
};

module.exports = MapController;