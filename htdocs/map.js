/* Add the map laters (normal OSM, topographical and satellite views) */

var defaultLayer = L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: ['a', 'b', 'c']
})

var terrainLayer = L.tileLayer( 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
  subdomains: ['a', 'b', 'c']
})

var satelliteLayer = L.tileLayer( 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
})

/* Create the marker (the icon) and a circle to show the error */

var thingyIcon = L.icon({
	iconUrl: 'images/thingy91_24.png',
	iconRetinaUrl: 'images/thingy91_48.png',
	iconSize: [24, 24],
	iconAnchor: [12, 12]
})

var markerIcon = L.marker( [0, 0], {
	icon: thingyIcon
});

var markerCircle = L.circle( [0, 0], 0 );

/* Construct the map with from all the elements we jsst created */

var map = L.map( 'map', {
  center: [0, 0],
  minZoom: 2,
  zoom: 9,
  layers: [defaultLayer]
})

var baseMaps = {
    "Default": defaultLayer,
    "Terrain": terrainLayer,
	"Satellite": satelliteLayer
};

var overlayMaps = {
};

L.control.layers(baseMaps, overlayMaps).addTo(map);

L.control.scale({position:'bottomright'}).addTo(map);

markerIcon.addTo(map);

markerCircle.addTo(map);

/* A function to update the marker location */

function updateMarker() {
	var httpRequest = new XMLHttpRequest();
	httpRequest.open('GET', 'location.php?t='+Date.now(), true);
	httpRequest.responseType = 'json';
	httpRequest.onload = function() {
		if (httpRequest.status === 200) {
			var newLatLng = new L.LatLng(httpRequest.response.lat, httpRequest.response.lon);
			markerIcon.setLatLng(newLatLng);		
			markerCircle.setLatLng(newLatLng);
			markerCircle.setRadius(httpRequest.response.uncertainty);
			map.panTo(newLatLng);
		}
	};
	httpRequest.send();	
}

/* Update the marker location, and then update every 60 seconds */

setInterval(updateMarker, 60000);

updateMarker();
