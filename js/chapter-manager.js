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

    });

	

   //TODO: remove unecessary precision
    // var zoom_coordinates = {
    //     "hoofdstuk 1": {northEast: L.latLng(54.29088164657006, 21.26953125), southWest: L.latLng(31.203404950917395, -27.3779296875) },
    //     "hoofdstuk 2": {northEast: L.latLng(35.06597313798418, 4.6142578125), southWest: L.latLng(19.932041306115536, -42.7587890625) },
    //     "hoofdstuk 3": {northEast: L.latLng(15.855673509998681, -13.798828125), southWest: L.latLng(7.471410908357826, -37.4853515625) },
    //     "k18": {northEast: L.latLng(51.916479358958874, 4.5406150817871085), southWest: L.latLng(51.89021285195025, 4.442424774169922) }
    // };

    // var intro_story = {
    //     "hoofdstuk 1": "Intro text hoofdstuk 1 Intro text hoofdstuk 1 Intro text hoofdstuk 1",
    //     "hoofdstuk 2": "Intro text hoofdstuk 2",
    //     "hoofdstuk 3": "Intro text hoofdstuk 3",
    //     "k18": "Intro hoofdstuk 4"
    // };

    //TODO put these in the config file
    // AND use to construct menu also
	// var banner_title = {
	// 	"hoofdstuk 1": "Hoofdstuk 1 <br /> Vertrek",
	// 	"hoofdstuk 2": "Hoofdstuk 2 <br /> Vulkanisme",
	// 	"hoofdstuk 3": "Hoofdstuk 3 <br /> Plaattektoniek",
 //        "k18": "K XVIII <br /> De Onderzeeboot"
	// };

	this.changeChapter = function(newChapter) {
	    //load data
	    //display data
	    //recenter map

	    var zoomTo = chapters[newChapter].zoom_coordinates;
	    map.fitBounds(L.latLngBounds([zoomTo.southWest, zoomTo.northEast]), {animate: true, pan: {duration: 1.0}});
	    chapters[currentChapter].chapter.hide(map);
	    chapters[newChapter].chapter.show(map);
	    currentChapter = newChapter;

	    //load content into interface
	    $("#blurb").html(chapters[newChapter].intro_story);
		$("#banner-chapter").html(chapters[newChapter].banner_title);
	    $('#geschiedenis-content').html(chapters[newChapter].chapter.getStory());
	    //$('#wetenschap-content').html(chapters[currentChapter].getStory());

	    //populate chart
	    loadChart(chapters[currentChapter].chapter.getMeasurements(), map);
	};
};