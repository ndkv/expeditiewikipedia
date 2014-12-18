module.exports = function (map) {
	var expeditions, 
		currentExpedition;
		that = this;


	$.getJSON("expeditions.json", function(data) {
		expeditions = data;

		for (var firstKey in expeditions) break;
			currentExpedition = firstKey;
	
		
	})
	.complete(function() { 
		initializeInterface();
		that.changeExpedition(map, currentExpedition);
	});


	// $.geoJSON("expeditions.geojson", function() {

	// });


	this.changeExpedition = function(map, expedition) {
		//populateInterface(expedition);
		$("#banner-title").text(expeditions[expedition].title);
		$("#banner-subtitle").text(expeditions[expedition].subtitle);

		populateMap(map);
	};

	function initializeInterface() {
		var expeditionMenu = $("#expeditions-menu");
		//menu.empty();
		
		var menuContent = $('<div class="menu-content"></div>');
		menuContent.appendTo(expeditionMenu);

		$.each(expeditions, function(index, value) {
			var menuItem = $("<div></div>", {
				id: index,
				class: "menu-item"
			});
			menuItem.appendTo(menuContent);

			$("<div></div>", {
				class: "menu-heading",
				text: value.title
			}).appendTo(menuItem);

			$("<div></div>", {
				class: "menu-title",
				text: value.subtitle
			}).appendTo(menuItem);
		});
	}

	function populateMap(map) {

	}
};