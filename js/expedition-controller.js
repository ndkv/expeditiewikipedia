var ExpeditionController = function() {
	this.expeditions = [];
	var features,
		that = this,
		mode = "landing",
		IC = require('./interface-controller.js'),
		InterfaceController,
		MapController,
		MC = require('./map-controller.js');

	$.when($.get('dist/data/expeditions.json'), $.get('dist/data/expeditions-geometries.json'))
	.done(function(exp, geoms) {
		if (typeof exp[0] === "string") {
			that.expeditions = $.parseJSON(exp[0]);
			features = $.parseJSON(geoms[0]).features;
		} else {
			that.expeditions = exp[0];
			features = geoms[0].features;
		}

		InterfaceController = new IC(that);
		MapController = new MC();

		//read hash from URL and direct to correct expedition
		//if urlParameters !== null {
			//go to specific expedition
			//call InterfaceController()
		//} else {
		//goto landing page

			console.log('checking hash on entry');
			var hash = location.hash;
			if (hash === '') {
				buildLandingView();
			} else {
				$.each(that.expeditions, function(index, value) {
					if (value.id === hash.substr(1)) { that.startExpedition(index); }
				});
			}

		//}

	});

	this.changeViewingMode = function() {
		//do stuff needed to transition from one mode to another
		  // change URL
		  // delete stuff from map
		  // destroy interface elements

		  //call constructors for new viewingMode
	};

	var buildLandingView = function() {
		mode = "landing";
		InterfaceController.buildLandingView();
		MapController.buildLandingView(features, that.expeditions);

		InterfaceController.registerMapEventsRoute();
		MapController.registerInterfaceEvents(InterfaceController);
	};

	this.startExpedition = function(index) {
		var expedition = that.expeditions[index].id,
			expeditionIndex = index;
		console.log(expedition);

		//load expedition information

		if (mode === "landing") {
			try {
				InterfaceController.destroyLandingView();
				MapController.destroyLandingView();
			}
			catch (err) {
				console.log("Failed to destroy expedition assets.");
				console.log("Assuming expedition launch through hash");
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
				
				setTimeout(function () { 
					MapController.buildExpeditionView(expedition, that.expeditions[expeditionIndex].maps, route, pois, that.expeditions[expeditionIndex].zoomto);
					InterfaceController.registerMapEventsPois();
					MapController.registerInterfaceEvents(InterfaceController);
				}, 1500);

			});

			mode = "expedition";
		} else {
			//destroy current expedition if in viewing mode
			//destroy expeditions if on landing page

			//call InterfaceController
			//call MapController
			//register events in both


		}
	};
};

module.exports = ExpeditionController;