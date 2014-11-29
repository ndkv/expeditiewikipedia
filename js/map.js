var map = new L.Map('map', {zoomControl: true, zoomAnimation: true, touchZoom: false});
map.setView([0.0, 55.0], 3);

//
//maps
//

// var osm = L.tileLayer.provider('OpenStreetMap.BlackAndWhite');
var osm = L.tileLayer("https://{s}.tiles.mapbox.com/v2/simeon.ifbdh3of/{z}/{x}/{y}.png");
//var osm = "";
//var osm = L.tileLayer("http://188.226.136.81/mapproxy/tiles/vm-mapbox-basemap_EPSG3857/{z}/{x}/{y}.png");

var wms_url = "http://188.226.136.81:80/mapproxy/service/";

// var osm = L.tileLayer.wms(wms_url, {
//     layers: 'vm-mapbox-basemap',
//     format: 'image/png',
//     transparent: true,
//     opacity: opacity,
//     tiled: true
// });

// var sat = L.tileLayer.provider('Esri.WorldImagery');
//var sat = L.tileLayer("https://{s}.tiles.mapbox.com/v2/simeon.ifbfma7f/{z}/{x}/{y}.png");
osm.addTo(map);

var opacity = 1.0;

var historical_map2 = L.tileLayer.wms(wms_url, {
    layers: 'indian',
    format: 'image/png',
    transparent: true,
    opacity: opacity
});
// historical_map2.addTo(map);
// historical_map2.bringToBack();

var historical_map = L.tileLayer.wms(wms_url, {
    layers: 'vening_light',
    format: 'image/png',
    transparent: true,
    opacity: opacity
});
// historical_map.addTo(map);
//    historical_map.bringToFront();

var route = L.tileLayer.wms(wms_url, {
    layers: 'vm-route',
    format: 'image/png',
    transparent: true,
    opacity: opacity
});
route.addTo(map);
route.bringToFront();
route.setZIndex(2);

var snip = L.tileLayer.wms(wms_url, {
    layers: 'vening-snip',
    format: 'image/png',
    transparent: true,
    opacity: opacity
});
//snip.addTo(map);

var base_layers = {"Achtergrondkaart": osm};//, "Luchtfoto": sat};
var overlays = {
    "Atlantische en Indische Oceaan": historical_map2,
    "Atlantische Oceaan": historical_map,
    //"De Snip + platen": snip,
    //"route": route
};

//
//map controls
//
var layerControl = L.control.layers(base_layers, overlays, {collapsed: true, position: 'topleft'});
//layers.addTo(map);

exports.map = map;
exports.layerControl = layerControl;
exports.overlays = overlays;