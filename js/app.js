//GLOBAL!!
$ = require('jquery-browserify');
jQuery = $;
require('./lib/jquery.fancybox.pack.js');
require('./lib/jquery-ui.js');
//require('highcharts-browserify');

//GLOBAL!!
L = require('leaflet');
require('./lib/leaflet-providers.js');
require('./lib/leaflet-label.js');
require('./lib/leaflet.markercluster.js');

function setFancybox() {
    $(".fancybox").fancybox({
        helpers: {
            overlay: {
                css: {
                    'background': 'rgba(0, 0, 0, 0.95)',
                    'z-index': '1001'
                }
            }
        }
    });

    $(".various").fancybox({
        maxWidth    : 708,
        maxHeight   : 482,
        fitToView   : false,
        // width       : '70%',
        // height      : '70%',
        autoSize    : true,
        closeClick  : false,
        openEffect  : 'none',
        closeEffect : 'none',
        helpers: {
            overlay: {
                css : { 'background': 'rgba(0, 0, 0, 0.70)',
                        'z-index': '1001'
                      }
                }
        }
    }); 
}

window.onload = function () {
    var loadChart = require('./charts.js');
    setFancybox();

    var initMap = require('./map.js');
    var map = initMap.map,
        layerControl = initMap.layerControl,
        overlays = initMap.overlays;

    //TODO remove this! Hack for chapter 3
    var wms_url = "http://188.226.136.81:80/mapproxy/service/";
    var snip = L.tileLayer.wms(wms_url, {
        layers: 'vening-snip',
        format: 'image/png',
        transparent: true,
        opacity: 1
    });

    var CP = require('./chapter-manager.js');
    var ChapterManager = new CP(map);
    require('./ui-events.js')(map, ChapterManager, overlays);      
};