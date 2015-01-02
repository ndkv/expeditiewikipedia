var ExpeditionController = function() {
	//var loadData = require('data-loader.js');
	//this.currentExpedition;
	//this.viewingMode; //landing, expedition
	
	var expeditions;
	var that = this;

	var IC = require('./interface-controller.js');
	var InterfaceController = new IC(this);
	var MC = require('./map-controller.js');
	var MapController = new MC();
	

	$.get('expeditions.json', function(data) {
		expeditions = data;

		//read hash from URL and direct to correct expedition
		//if urlParameters !== null {
			//go to specific expedition
			//call InterfaceController()
		//} else {
		//goto landing page
			//that.buildLandingView();
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
		//start app in default view
		InterfaceController.buildLandingView();
		MapController.buildLandingView(expeditionGeometries, labelGeometries);

		InterfaceController.registerMapEvents(MapController);
		MapController.registerInterfaceEvents(InterfaceController);

	};

	this.loadExpedition = function(expedition) {
		currentExpedition = expedition;
		//destroy current expedition if in viewing mode
		//destroy expeditions if on landing page

		//call InterfaceController
		//call MapController
		//register events in both
	};
};

module.exports = ExpeditionController;