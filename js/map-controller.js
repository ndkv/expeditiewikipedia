var MapController = function() {
	var features = []; //are either routes for introscreen or POIs
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
	};

	var destroyFeatures = function() {
		//deregister events? or handle by empty() the linked element?

	};

	var zoomTo = function(e) {
		var index = e.vmIndex;
		map.fitBounds(features[index].getBounds());
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

		pois.map(function(pois) {
			var coords = pois[1];
			var marker = L.marker([coords[1], coords[0]]);
			marker.addTo(map);
		});
	};
	
	//this.destroyExpeditionView

	$(document).bind('mapZoomTo', zoomTo);
};

module.exports = MapController;