module.exports = function (map) {
	var expeditions, 
		currentExpedition;


	$.getJSON("expeditions.json", function(data) {
		expeditions = data;

		for (var firstKey in expeditions) break;
			currentExpedition = firstKey;
	
		populateInterface(currentExpedition);
	});


	// $.geoJSON("expeditions.geojson", function() {

	// });


	this.changeExpedition = function(map, expedition) {
		populateInterface(expedition);
		populateMap(map);
	};

	function populateInterface(expedition) {
		$("#banner-title").text(expeditions[expedition].title);
		$("#banner-subtitle").text(expeditions[expedition].subtitle);

	}

	function populateMap(map) {

	}

	function buildMenu() {
		
	}
};