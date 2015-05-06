//GLOBALS!!
L = require('leaflet');
require('leaflet-providers');
L.Icon.Default.imagePath = 'images/icons/';
jQuery = require('jquery-browserify');
$ = jQuery;
Swiper = require('swiper');
require('./lib/papaparse')(window);
require('fancybox')($);

window.onload = function() {

	// show pop-up screen when site loaded
	// for the first time
	if (document.cookie === "") {
		$('#introduction')
	    .css('display', 'block')
	    .fancybox({	
	    	autoSize: false,
	    	width: 600,
	    	height: 600,
	    	openEffect: 'none',
	    	padding: 0
	    })
	    .trigger('click');		

	    document.cookie = 'introwindow=true';
	}

	var EC = require('./expedition-controller.js');
	var ExpeditionController = new EC();
};