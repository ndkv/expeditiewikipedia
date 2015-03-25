//GLOBALS!!
L = require('leaflet');
require('leaflet-providers');
L.Icon.Default.imagePath = 'images/icons/';
jQuery = require('jquery-browserify');
$ = jQuery;
Swiper = require('swiper');
//Papa =  require('papaparse');
require('fancybox')($);

window.onload = function() {

	// if (document.cookie === "") {
		$('#introduction')
	    .css('opacity', 1)
	    .fancybox({	
	    	autoSize: false,
	    	width: 600,
	    	height: 600,
	    	openEffect: 'none',
	    	padding: 0
	    })
	    .trigger('click');		

	    // document.cookie = 'introwindow=true';
	// }

	var EC = require('./expedition-controller.js');

	var ExpeditionController = new EC();
};