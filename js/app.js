//GLOBALS!!
L = require('leaflet');
L.Icon.Default.imagePath = 'images/icons/';
jQuery = require('jquery-browserify');
$ = jQuery;
Dragend = require('./lib/dragend-vert.js');
Swiper = require('swiper');

window.onload = function() {
	var EC = require('./expedition-controller.js');

	//implement data loader?
	var ExpeditionController = new EC();

	//check whether URL contains specific expedition

	console.log("loaded");

};