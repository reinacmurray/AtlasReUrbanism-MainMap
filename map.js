//Initialize map

var map = L.map('map', {zoomControl: false}).setView([42.306, -109.093], 4);
map.options.minZoom = 3;
map.options.maxZoom = 9;



// Set up home zoom
var zoomHome = L.Control.zoomHome({position: 'topleft'});
zoomHome.addTo(map);


// Set up icons
var reurbIcon = L.icon({
	iconUrl: 'https://cdn.rawgit.com/reinacmurray/c00640af2686ae79dfcad81a6179d720/raw/7b51060107325ae91c3f88b86290296b90ffc9ea/reurbpin-red.svg',
	iconSize: [30, 48],
	iconAnchor: [15, 48],
	popupAnchor:  [0, -50] 
});

var reurbIcon_grey = L.icon({
	iconUrl: 'https://cdn.rawgit.com/reinacmurray/61b24f2ccc9926db712eb029aa553172/raw/e1f45af304770e980e6a6c97dbd6ca06ba50c9d5/reurbpin-grey.svg',
	iconSize: [25, 40],
	iconAnchor: [13, 40],
	popupAnchor: [0, -43] 
});


//Load basemap
var CartoDB_PositronNoLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(map);
// https: also suppported.
var Stamen_TonerLabels = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
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
