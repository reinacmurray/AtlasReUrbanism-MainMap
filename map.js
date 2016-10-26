//Initialize map

var map = L.map('map', {zoomControl: false}).setView([42.306, -109.093], 4);


// Set up home zoom
var zoomHome = L.Control.zoomHome({position: 'topleft'});
zoomHome.addTo(map);


// Set up icons
var reurbIcon = L.icon({
	iconUrl: 'https://cloud.githubusercontent.com/assets/11901766/19712711/2ee28e6a-9b0e-11e6-940c-436276641ffd.png',
	iconSize: [30, 48],
	iconAnchor: [15, 48],
	popupAnchor:  [0, -50] 
});

var reurbIcon_grey = L.icon({
	iconUrl: 'https://cloud.githubusercontent.com/assets/11901766/19712713/2ee933d2-9b0e-11e6-9d37-f553034824fc.png',
	iconSize: [25, 40],
	iconAnchor: [13, 40],
	popupAnchor: [0, -43] 
});


//Load basemap
var Hydda_Base = L.tileLayer('https://{s}.tile.openstreetmap.se/hydda/base/{z}/{x}/{y}.png', 
	{
		attribution: 'Tiles courtesy of <a href="https://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  	}).addTo(map);

var Stamen_TonerHybrid = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-hybrid/{z}/{x}/{y}.{ext}', 
	{
    	attribution: 'Map tiles by <a href="https://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    	subdomains: 'abcd',
    	minZoom: 0,
    	maxZoom: 10,
    	ext: 'png'
  	}).addTo(map);


//Unpublished cities
map.createPane('inactive');

var atlas_unpub = L.esri.featureLayer({
	url: "https://services3.arcgis.com/8mRVhBBtAu5eqZUu/arcgis/rest/services/AtlasCities/FeatureServer/0",
	where: "status = 'Inactive'",
	pointToLayer: function(geojson, latlng) {
		return L.marker(latlng, {
			icon: reurbIcon_grey,
			pane: 'inactive'
		});
	}
}).addTo(map);

atlas_unpub.bindPopup(function (evt) {
    return L.Util.template('<h2>{city}, {state}</h2><p>{mapurl}</p>', evt.feature.properties);
  });

//Published cities
map.createPane('published');

var atlas_pub = L.esri.featureLayer({
	url: "https://services3.arcgis.com/8mRVhBBtAu5eqZUu/arcgis/rest/services/AtlasCities/FeatureServer/0",
	where: "status = 'Published'",
	pointToLayer: function(geojson, latlng) {
		return L.marker(latlng, {
			icon: reurbIcon,
			pane: 'published'
		});
	}
}).addTo(map);

atlas_pub.bindPopup(function (evt) {
    return L.Util.template('<h2>{city}, {state}</h2><h3><a href="{mapurl}" target="_blank">MAP</a></h3><h3><a href="{facturl}" target="_blank">FACTSHEET</a></h3>', evt.feature.properties);
  });


// Set up layers control
var overlayMaps = {
	"Published": atlas_pub,
	"Coming Soon": atlas_unpub
};

L.control.layers(null, overlayMaps).addTo(map);
