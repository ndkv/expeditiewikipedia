var ExpeditionController = function() {
	this.expeditions = [];
	var features,
		that = this,
		mode,
		IC = require('./interface-controller.js'),
		InterfaceController,
		MapController,
		MC = require('./map-controller.js');

	$.when($.get('data/expeditions.json'), $.get('data/expeditions-geometries.json'))
	.done(function(exp, geoms) {
		if (typeof exp[0] === "string") {
			that.expeditions = $.parseJSON(exp[0]);
			features = $.parseJSON(geoms[0]).features;
		} else {
			that.expeditions = exp[0];
			features = geoms[0].features;
		}

		InterfaceController = new IC(that);
		InterfaceController.initializeEvents();
		MapController = new MC();

		//check hash on entry and start individual expedition if necessary
		var hash = location.hash;
		if (hash === '') {
			buildLandingView();
		} else {
			$.each(that.expeditions, function(index, value) {
				if (value.id === hash.substr(1)) { that.startExpedition(index); }
			});
		}
	});

	function buildLandingView() {
		mode = "landing";
		InterfaceController.buildLandingView();
		MapController.buildLandingView(features, that.expeditions);

		InterfaceController.registerMapEventsRoute();
		MapController.registerInterfaceEvents(InterfaceController);
	}

	// TODO: uncouple from InterfaceController and use trigger/bind
	this.startExpedition = function(index) {
		var expedition = that.expeditions[index].id,
			expeditionIndex = index;

		//load expedition information
		if (mode === "landing") {
			InterfaceController.destroyLandingView();
			MapController.destroyLandingView();
		}

		$.getJSON("data/" + expedition + "/geometries.json", function(geometries) {
			var features = geometries.features,
				route,
				pois = [];
				// geoms = $.parseJSON(expedition);

			$.each(features, function(index, value) {
				if (value.properties.type === "route") {
					route = value;
				} else {
					pois.push([value.properties, value.geometry.coordinates]);
				}
			});

			InterfaceController.buildExpeditionView(expedition, expeditionIndex, pois);

			MapController.buildExpeditionView(expedition, that.expeditions[expeditionIndex].maps, route, pois, that.expeditions[expeditionIndex].zoomto);
			InterfaceController.registerMapEventsPois();
			MapController.registerInterfaceEvents(InterfaceController);

		});

		mode = "expedition";
	};
};

module.exports = ExpeditionController;