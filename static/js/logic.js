// Create a initial map object
var myMap = L.map('map',{
    center:[37.0902, -95.7129],
    zoom: 5
})

// Add a tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
}).addTo(myMap);


// Function to determine circle color based on the magnitude 
function getColor(magnitude){
    switch(true){
        case (magnitude <= 1):
            return '#ccff66';
            break;
        case (magnitude <= 2):
            return '#ffff66';
            break;
        case (magnitude <= 3):
            return '#ff9933';
            break;
        case (magnitude <= 4):
            return '#ff5050';
            break;
        case (magnitude <= 5):
            return '#ff0066';
            break;
        case (magnitude > 5):
            return '#990099';
            break;
        default:
            return '#cccccc';
            break;
    }
}

// Function to determine circle radius based on the magnitude 
function getRadius(magnitude){
    switch(true){
        case (magnitude <= 1):
            return 5;
            break;
        case (magnitude <= 2):
            return 7;
            break;
        case (magnitude <= 3):
            return 9;
            break;
        case (magnitude <= 4):
            return 11;
            break;
        case (magnitude <= 5):
            return 13;
            break;
        case (magnitude > 5):
            return 15;
            break;
        default:
            return 1;
            break;
    }
}  

var GeoJSONUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(GeoJSONUrl).then(function(data){

    L.geoJson(data,{
        pointToLayer: function (feature, latlng) {
            // Create a circle marker
            return L.circleMarker(latlng, {
                radius: getRadius(feature.properties.mag), // different radius for different magnitude
                fillColor: getColor(feature.properties.mag), // different circle colors for different magnitude
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function(feature, layer){
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><span>Magnitude: ${feature.properties.mag}</span>`)
        }
    }).addTo(myMap);
    
    // Create a legend
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            mag = [0, 1, 2, 3, 4, 5]
        
        div.innerHTML += "<h4>Magnitude Level</h4><hr>"
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < mag.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(mag[i] + 1) + '"></i> ' +
                mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);
    
    // Legend source1: https://leafletjs.com/examples/choropleth/
    // Legend source2: https://codepen.io/haakseth/pen/KQbjdO
});