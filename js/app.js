//GLOBALS!!
L = require('leaflet');
jQuery = require('jquery-browserify');
$ = jQuery;
Dragend = require('./lib/dragend-vert.js');

window.onload = function() {
	var EC = require('./expedition-controller.js');

	//implement data loader?
	var ExpeditionController = new EC();

	//check whether URL contains specific expedition

	console.log("loaded");

<<<<<<< HEAD
    var EM = require('./expedition-manager.js');
    var expeditionManager = new EM(map);

    var CM = require('./chapter-manager.js');
    var ChapterManager = new CM(map);
    require('./ui-events.js')(map, ChapterManager, overlays);
    //ChapterManager.buildInterface();    
=======
	
>>>>>>> top-drawer
};