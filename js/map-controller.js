var MapController = function() {
	var features = [],
		poisList = [],
		overlays = [],
		currentExpedition,
		listeners = [],
		basemaps = [];
	
	var map = new L.Map('map', {zoomControl: true, zoomAnimation: true, touchZoom: true});
	map.setView([0.0, 55.0], 3);

	this.registerInterfaceEvents = function(InterfaceController) {
		$.each(features, function(index, feature) {
			var handler = function () {
				//InterfaceController.openDetailView(index);
				InterfaceController.togglePreviewItem(index);
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

	this.buildLandingView = function(feats) {
		$.each(feats, function(index, value) {
			var geometry = value.geometry.coordinates;
			var coordinates = [];

			//reverse geojson.io's lat/lng order
			$.each(geometry, function(i, v) {
				coordinates.push([v[1], v[0]]);
			});

			var feature = L.polyline(coordinates);
			feature.addTo(map);
			features.push(feature);
		});

		var basemap = L.tileLayer("https://{s}.tiles.mapbox.com/v2/simeon.ifbdh3of/{z}/{x}/{y}.png");
		basemap.addTo(map);
		basemaps.push(basemap);
	};

	this.destroyLandingView = function() {
		$.each(features, function(index, feature) {
			//feature.off('click', listeners.pop(index));
			map.removeLayer(feature);
		});

		features = [];
		
	};

	this.buildExpeditionView = function(expedition, maps, route, pois) {
		currentExpedition = expedition;
		loadMaps(maps);
		buildExpeditionGeometries(route, pois);

		// $('.leaflet-tile-pane').css('-webkit-transition', 'opacity 3s');
		// $('.leaflet-layer').css('-webkit-transition', 'opacity 3s');
		// $('.leaflet-tile-container').css('-webkit-transition', 'opacity 3s');
		
		var basemap = L.tileLayer.provider('Esri.OceanBasemap', {opacity: 0});
		
		var handler = function() {
			$('.leaflet-tile-pane').css('transition', 'opacity .45s');
			$('.leaflet-layer').css('transition', 'opacity .45s');
			$('.leaflet-tile-container').css('transition', 'opacity .45s');
			basemap.setOpacity(1);
			basemaps[0].setOpacity(0);
 	
			setTimeout(function() {
				$('.leaflet-tile-pane').css('transition', '');
				$('.leaflet-layer').css('transition', '');
				$('.leaflet-tile-container').css('transition', '');
				map.removeLayer(basemaps[0]);
				basemap.off('load', handler);
			}, 350);
		};

		basemap.on('load', handler);

		basemap.addTo(map);
	};

	var buildExpeditionGeometries = function(route, pois) {
		var routeGeometry = route.geometry.coordinates
		.map(function(coords) { return [coords[1], coords[0]]; });

		var feature = L.polyline(routeGeometry);
		feature.addTo(map);
		map.fitBounds(feature.getBounds());
		map.zoomOut();
		features.push(feature);


		//to do: put in a data reading module
		var sortable = [];
		$.each(pois, function(index, poi) {
			sortable.push([poi[0].order, poi[1]]);	
		});
		sortable.sort(function(a, b) { return a[0] - b[0]; });

		sortable.map(function(pois) {
			var coords = pois[1];
			var marker = L.marker([coords[1], coords[0]]);
			marker.addTo(map);

			poisList.push(marker);
		});
	};

	var loadMaps = function(maps) {
		try {
				$.each(maps, function(index, value) {
				var path = 'data/' + currentExpedition + '/maps/' + value + '/{z}/{x}/{y}.png';
				var overlay = L.tileLayer(path, { tms: true, updateWhenIdle: true });
				//overlay.addTo(map);
				overlays.push(overlay);
			});
		}
		catch (e) {
			console.log('no maps');
		}
	};
	
	//this.destroyExpeditionView

	var zoomToRoute = function(e) {
		var index = e.vmIndex;
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
};

module.exports = MapController;