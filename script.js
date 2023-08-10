// Tile layers
var osmMap = L.tileLayer.provider('OpenStreetMap.Mapnik');

// Google Map Layer
var googleStreets = L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}',{
    subdomains:['mt0','mt1','mt2','mt3']
});

// Satellite Layer
var googleSat = L.tileLayer('http://{s}.google.com/vt?lyrs=s&x={x}&y={y}&z={z}',{
    subdomains:['mt0','mt1','mt2','mt3']
});

var baseMaps = {
  OSM: osmMap,
  'Google Map': googleStreets,
  'Satellite': googleSat
};

// Initialize the map
var map = L.map('map', {
  center: [-15.408193, 28.287166],
  zoom: 5,
  layers: [osmMap]
});

// Add Leaflet Geocoder control
var geocoderControl = L.Control.geocoder({
  defaultMarkGeocode: true,
}).addTo(map);

// Create a layer group for the District Boundary layer
var districtBoundaryLayerGroup = L.layerGroup();

// Add the tile layer control with base maps and overlays
L.control.layers(baseMaps, { 'District Boundary': districtBoundaryLayerGroup }, { collapsed: true }).addTo(map);



// Function to calculate the area and center coordinates
function calculateAreaAndCenter(feature) {
  var area = (turf.area(feature) / 1000000).toFixed(2);
  var center = turf.centerOfMass(feature);
  var center_lat = center.geometry.coordinates[1];
  var center_long = center.geometry.coordinates[0];

  return {
    area: area,
    center_lat: center_lat,
    center_long: center_long
  };
}

// Add the District Boundary layer
fetch('resources/District_Boundary.js')
  .then(response => response.json())
  .then(data => {
    // Create the GeoJSON layer for District Boundary with custom style
    var districtBoundaryLayer = L.geoJSON(data, {
      style: {
        color: '#0000ff', // Stroke color
        weight: 2, // Stroke width
        fillOpacity: 0.2, // No fill
      },
      onEachFeature: function (feature, layer) {
        var calculatedValues = calculateAreaAndCenter(feature);
        var area = calculatedValues.area;
        var center_lat = calculatedValues.center_lat;
        var center_long = calculatedValues.center_long;
        var bbox = turf.bbox(feature);

        layer.bindPopup(`<b>Area: </b>${area} km<br><b>Center (Lat, Long): </b>${center_lat}, ${center_long}<br><b>Bbox: </b>[${bbox.join(', ')}]`);
      }
    }).addTo(districtBoundaryLayerGroup);
  })
  .catch(error => {
    console.error('Error:', error);
  });

  var popup = L.popup();
function onMapClick(e) {
  popup
  .setLatLng(e.latlng)
  .setContent("Map Clicked at " + e.latlng.toString())
  .openOn(map);
}
map.on('click', onMapClick);

  // Measure Control
  var measureOptions = {
    position: 'topleft', // Change this if needed
    unit: 'metres', // Change this to the desired unit
    clearMeasurementsOnStop: true,
    showBearings: true,
    bearingTextIn: 'In',
    bearingTextOut: 'Out',
    tooltipTextDragandresume: 'Drag to resume line',
    tooltipTextDelete: 'Click to delete last point',
    tooltipTextMove: 'Click to move this point',
    tooltipTextAdd: 'Click to add a new point',
    totalPopupTitle: 'Total distance',
    clearAllText: 'Clear All',
    tooltipTextAdd: 'Click to start measuring',
    measureControlTitleOn: 'Turn on Measure',
    measureControlTitleOff: 'Turn off Measure'
  };

  // Add Polyline Measure control to the map
  L.control.polylineMeasure(measureOptions).addTo(map);
