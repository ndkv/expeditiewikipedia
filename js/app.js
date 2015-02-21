//GLOBALS!!
L = require('leaflet');
require('leaflet-providers');
L.Icon.Default.imagePath = 'images/icons/';
jQuery = require('jquery-browserify');
$ = jQuery;
Swiper = require('swiper');
Papa =  require('papaparse');

window.onload = function() {
	var EC = require('./expedition-controller.js');

	//implement data loader?
	var ExpeditionController = new EC();

	//check whether URL contains specific expedition

	console.log("loaded");

};