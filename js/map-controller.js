var MapController = function() {
	var features; //are either routes for introscreen or POIs
	this.overlays = [];
	this.basemaps = [];

	var listeners = [];

	var map = new L.Map('map', {zoomControl: true, zoomAnimation: true, touchZoom: true});
	map.setView([0.0, 55.0], 3);
	var basemap = L.tileLayer("https://{s}.tiles.mapbox.com/v2/simeon.ifbdh3of/{z}/{x}/{y}.png");
	basemap.addTo(map);

	//set up intro screen map
	  //load all expeditions from ExpeditionController
	  //link map events to interface
	  //link interface events to map


	var loadExpeditions = function() {

	};

	var loadPoIs = function() {

	};

	var loadHistoricalMaps = function() {

	};

	this.registerInterfaceEvents = function(InterfaceController) {
		$.each(features, function(index, feature) {
			var handler = function () {
				InterfaceController.openDetailView(feature.id);
			};

			listeners.append(handler);
			feature.on('click', handler);
				
		});
	};

	this.destroyInterfaceEvents = function(InterfaceController) {
		$.each(handler, function(index, value) {
			feature.off('click', listeners.pop(index));
		});
	};

	var destroyFeatures = function() {
		//deregister events? or handle by empty() the linked element?

	};

	this.zoomTo = function(id) {
		//TODO: implement zoomTo for POIs
		var coords = features[id].getBounds();
		map.zoomTo();
	};

	//VIEWING MODE 

	this.buildLandingView = function(expeditionGeometries, labelGeometries) {
		$.each(expeditionGeometries, function(index, value) {
			//var feature = ...
			features.append(feature);
		});
	};

	//this.destroyLandingView

	//this.buildExpeditionView
	//this.destroyExpeditionView
};

module.exports = MapController;