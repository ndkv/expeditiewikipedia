// Chapter class

module.exports = function (map) {
//chapter-manager
	var path = "../data/vening meinesz/";

	var Chapter = require('./chapter.js');
	var chapters = {},
	    currentChapter;

    $.getJSON(path + "config.json", function (data) {
        console.log("getting config.json");

        chapters = data;

        $.each(data, function(index, value) {
            chapters[index].chapter = new Chapter(path + index);
        });

        //currentChapter = Object.keys(chapters)[0];
        for (var firstKey in chapters) break;
        currentChapter = firstKey;

    })
    .error(function (){ console.log("error fetching configuration"); })
    .complete(function () { buildInterface(); });

	this.changeChapter = function(newChapter) {


	    var zoomTo = chapters[newChapter].zoom_coordinates;
	    map.fitBounds(L.latLngBounds([zoomTo.southWest, zoomTo.northEast]), {animate: true, pan: {duration: 1.0}});
	    chapters[currentChapter].chapter.hide(map);
	    chapters[newChapter].chapter.show(map);
	    currentChapter = newChapter;

	    //load content into interface
	    //TODO: create an interface object and apss it around
	    $("#blurb").html(chapters[newChapter].intro_story);
		$("#banner-chapter").html(chapters[newChapter].banner_title);
	    $('#geschiedenis-content').html(chapters[newChapter].chapter.getStory());
	    //$('#wetenschap-content').html(chapters[currentChapter].getStory());

	    //populate chart
	    loadChart(chapters[currentChapter].chapter.getMeasurements(), map);
	};

	function buildInterface() {
		var menu = $("#menu");
		//menu.empty();
		
		var menuContent = $('<div class="menu-content"></div>');
		menuContent.appendTo(menu);

		$.each(chapters, function(index, value) {
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
};