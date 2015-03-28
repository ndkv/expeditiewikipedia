var MapController = function() {
	var features = {},
		featureMarkers = {},
		poisList = [],
		overlays = {},
		currentExpedition,
		listeners = [],
		basemaps = [],
		southWest = L.latLng(-70, -175),
		northEast = L.latLng(90, 180),
		bounds = L.latLngBounds(southWest, northEast), 
		selectedPoi;

	var map = new L.Map('map', {
		zoomControl: false,
		zoomAnimation: true,
		touchZoom: true,
		maxBounds: bounds,
		minZoom: 2,
		maxZoom: 10
	});
	map.setView([0.0, 55.0], 2);
	map.on('click', function () {
		console.log(map.getCenter());
		console.log(map.getZoom());
		console.log(map.latLngToContainerPoint(map.getCenter()));
	});

	this.registerInterfaceEvents = function(InterfaceController) {
		$.each(features, function(id, feature) {
			var handler = function () {
				InterfaceController.togglePreviewItemLanding(id);
			};

			listeners.push(handler);
			feature.on('click', handler);

			$.each(featureMarkers[id], function(index, value) {
				value.on('click', handler);
			});
		});

		var $swiper = $('.swiper-wrapper'),
			swiperOffset = $swiper.offset().left,
			spacerLeftWidth = $('.spacer-left').width(),
			spacerRightShadow = 30,
			spacerRightWidth = $('.spacer-right').width() + spacerRightShadow,
			margin = 20,
			offset;

		//only available in expedition view
		//fix
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
				$swiper.css('-transform', translate);
				$swiper.css('-transition', 'transform .5s ease-out');

				togglePoiSelection(poi);
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
		var icon = new L.Icon({iconUrl: getMarkerImageUrl() + 'marker-icon.svg', iconSize: [25, 25]});

		$.each(feats, function(index, value) {
			var geometry = value.geometry.coordinates,
				type = value.geometry.type,
				coordinates = [],
				feature,
				marker;

			featureMarkers[value.properties.id] = [];

			//reverse geojson.io's lat/lng order
			

			if (type === 'LineString') {
				$.each(geometry, function(i, v) {
					coordinates.push([v[1], v[0]]);
					marker = L.marker([v[1], v[0]], {icon: icon});
					marker.addTo(map);
					featureMarkers[value.properties.id].push(marker);
				});

				feature = L.polyline(coordinates, {
					weight: 2,
					opacity: 0.9, 
					color: 'black', 
					// dashArray: '10, 5',
					lineCap: 'butt',
					lineJoin: 'round'
				});
			}

			if (type === "Polygon") {
				$.each(geometry[0], function(i, v) {
					coordinates.push([v[1], v[0]]);
					// var marker = L.marker([v[1], v[0]], {icon: new L.Icon({iconUrl: getMarkerImageUrl() + 'marker-icon.svg', iconSize: [20, 20]})});
					// marker.addTo(map);
				});

				feature = L.polygon(coordinates, {
					weight: 2,
					opacity: 0.9, 
					// color: '#d00', 
					color: 'black',
					// dashArray: '10, 5',
					lineCap: 'butt',
					lineJoin: 'round'
				});
			}

			feature.addTo(map);

			features[value.properties.id] = feature;
		});

		// var basemap = L.tileLayer("https://{s}.tiles.mapbox.com/v2/simeon.ifbdh3of/{z}/{x}/{y}.png");
		var basemap = L.tileLayer('data/basemap/{z}/{x}/{y}.png', {
			tms: false,
			maxNativeZoom: 5
		});

		basemap.addTo(map);
		basemaps.push(basemap);

		$.each(expeditions, function(index, value) {
			loadMaps(value.id, value.maps, 'landing');
		});
	};

	this.destroyLandingView = function() {
		$.each(features, function(index, feature) {
			map.removeLayer(feature);
		});
		features = {};

		$.each(overlays, function(index, overlay) {
			map.removeLayer(overlay);
		});
		overlays = [];

		$.each(featureMarkers, function(index, markers) {
			$.each(markers, function(index, marker) {
				map.removeLayer(marker);				
			});
		});
		featureMarkers = {};

		
	};

	this.buildExpeditionView = function(expedition, maps, route, pois, zoomTo) {
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

				loadMaps(expedition, maps, 'expedition');
			}, 350);
		};

		basemap.on('load', handler);

		basemap.addTo(map);
		map.setView([zoomTo.lat, zoomTo.lon], zoomTo.zoom);
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
			sortable.push([poi[0].order, poi[1], poi[0].zoomTo]);	
		});
		sortable.sort(function(a, b) { return a[0] - b[0]; });

		sortable.map(function(pois) {
			var icon = new L.Icon({iconUrl: getMarkerImageUrl() + 'marker-icon.svg', iconSize: [26, 26]});
			icon.options.shadowSize = [0,0];
			var coords = pois[1];
			var marker = L.marker([coords[1], coords[0]], {icon: icon});
			marker.vmZoomTo = pois[2];
							
			marker.addTo(map);

			poisList.push(marker);
		});
	};

	var loadMaps = function(currentExpedition, maps, mode) {
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
				overlays[value.id] = overlay;

				if (mode === 'landing' && value.visibleIntro === true) {
					overlay.addTo(map);
				} else if (mode === 'expedition' && value.visibleExpedition === true) {
					overlay.addTo(map);
				}

			});
		}
		catch (e) {
			console.log('Warning: failed to fetch map.');
			if (maps === undefined) { console.log('This expedition does not have any maps.'); }
		}
	};
	
	//this.destroyExpeditionView

	var zoomToRoute = function(e) {
		var index = e.expeditionId;
		console.log('catching zoom to route trigger');
		map.setView([e.zoomTo.lat, e.zoomTo.lon], e.zoomTo.zoom);
	};

	var zoomToPoi = function(e) {
		console.log('catchintg zoomToPoi trigger');
		var index = e.vmIndex;
		var poi = poisList[index];
		map.setView(poi.getLatLng(), poi.vmZoomTo);

		togglePoiSelection(poi);
	};

	var toggleLayer = function(event, id) {
		var layer = overlays[id];
		if (map.hasLayer(layer)) {
			map.removeLayer(layer);
		} else {
			map.addLayer(layer);
		}
	};

	var togglePoiSelection = function(poi) {
		var baseUrl = getMarkerImageUrl();
		
		if (selectedPoi !== undefined) {
			selectedPoi.setIcon(new L.Icon({iconUrl: baseUrl + 'marker-icon.svg'}));
			poi.setIcon(new L.Icon({iconUrl: baseUrl + 'marker-icon-selected.svg'}));
			selectedPoi = poi;
		} else {
			poi.setIcon(new L.Icon({iconUrl: baseUrl + 'marker-icon-selected.svg'}));
			selectedPoi = poi;
		}
	};

	var getMarkerImageUrl = function() {
		var baseUrl = window.location.origin;
		if (window.location.pathname !== undefined) { baseUrl += window.location.pathname; }
		baseUrl += 'dist/images/icons/';
		return baseUrl;
	};

	$(document).bind('mapZoomToRoute', zoomToRoute);
	$(document).bind('mapZoomToPoI', zoomToPoi);
	$(document).bind('_toggleOverlayVisibility', toggleLayer);
	$(document).bind('_mapZoomIn', function() { map.zoomIn(); });
	$(document).bind('_mapZoomOut', function() { map.zoomOut(); });
};

module.exports = MapController;