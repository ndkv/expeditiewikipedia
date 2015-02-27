//GLOBALS!!
L = require('leaflet');
require('leaflet-providers');
L.Icon.Default.imagePath = 'images/icons/';
jQuery = require('jquery-browserify');
$ = jQuery;
Swiper = require('swiper');
Papa =  require('papaparse');
require('fancybox')($);

window.onload = function() {

	 $('#introduction')
    .css('opacity', 1)
    .fancybox({	
    	autoSize: false,
    	width: 500,
    	height: 250,
    	openEffect: 'none'
    })
    .trigger('click');

	var EC = require('./expedition-controller.js');

	//implement data loader?
	var ExpeditionController = new EC();

	//check whether URL contains specific expedition

	console.log("loaded");

};