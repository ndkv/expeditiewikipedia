var MapController = function() {
	var features = []; //are either routes for introscreen or POIs
	var poisList = [];
	this.overlays = [];
	this.basemaps = [];

	var listeners = [];

	var map = new L.Map('map', {zoomControl: true, zoomAnimation: true, touchZoom: true});
	map.setView([0.0, 55.0], 3);
	var basemap = L.tileLayer("https://{s}.tiles.mapbox.com/v2/simeon.ifbdh3of/{z}/{x}/{y}.png");
	basemap.addTo(map);

	var loadExpeditions = function() {

	};

	var loadPoIs = function() {

	};

	var loadHistoricalMaps = function() {

	};

	this.registerInterfaceEvents = function(InterfaceController) {
		$.each(features, function(index, feature) {
			var handler = function () {
				//InterfaceController.openDetailView(index);
				InterfaceController.togglePreviewItem(index);
			};

			listeners.push(handler);
			feature.on('click', handler);
		});


		var $swiper = $('.swiper-wrapper');

		$.each(poisList, function (index, poi) {
			var handler = function () { 
				InterfaceController.togglePreviewItem(index); 

				var swiperOffset = $swiper.offset().left,
					docWidth = $(document).width(), 
					docSwiperDiff = docWidth - $swiper.width(),				
					$element = $('.expeditionItem').eq(index),
					margin = 20,
					elemMid = $element.offset().left + $element.width()/2 + margin/2,
					elem = index + 1,
					offset;

				if (docSwiperDiff < 0) {
					switch (index) {
						case 0:
							offset = 0;
							break;
						case poisList.length - 1:
							offset = docSwiperDiff;
							break;
						default:
							if (elemMid < docWidth/2) {
								offset = swiperOffset + (docWidth/2 - elemMid);
								if (offset > 0) { offset = 0; }
							} else if (elemMid > docWidth/2) {
								offset = swiperOffset - (elemMid - docWidth/2);
								if (offset < docSwiperDiff) { offset = docSwiperDiff; }
							}
							break;
					}
				}

				$swiper.css('-webkit-transform', 'translate3d(' + offset + 'px, 0px, 0px');
			};

			// $swiper.css('-webkit-transition', '1s');
			// $swiper.css({
			// 	WebkitTransition : 'transfom 1s ease-out',
			// 	MozTransition    : 'transfom 1s ease-out',
			// 	MsTransition     : 'transfom 1s ease-out',
			// 	OTransition      : 'transfom 1s ease-out',
			// 	transition       : 'transfom 1s ease-out'
			// });
		
			listeners.push(handler);
			poi.on('click', handler);
		});
	};

	var destroyFeatures = function() {
		//deregister events? or handle by empty() the linked element?

	};

	var zoomToRoute = function(e) {
		var index = e.vmIndex;
		map.fitBounds(features[index].getBounds());
	};

	var zoomToPoi = function(e) {
		var index = e.vmIndex;
		map.panTo(poisList[index].getLatLng());
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
	};

	this.destroyLandingView = function() {
		$.each(features, function(index, feature) {
			//feature.off('click', listeners.pop(index));
			map.removeLayer(feature);
		});

		features = [];
	};

	this.buildExpeditionView = function(route, pois) {
		var routeGeometry = route.geometry.coordinates
		.map(function(coords) { return [coords[1], coords[0]]; });

		var feature = L.polyline(routeGeometry);
		feature.addTo(map);
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
	
	//this.destroyExpeditionView

	$(document).bind('mapZoomToRoute', zoomToRoute);
	$(document).bind('mapZoomToPoI', zoomToPoi);
};

module.exports = MapController;