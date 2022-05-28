var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
d3.json(url).then(function(data) {
    createFeatures(data.features);
});
function getColor(depth) {
    if (depth < 10) {
        return "#99ff33"
    } else if (depth < 30) {
        return "#33cc33"
    } else if (depth < 50) {
        return "#ffff00"
    } else if (depth < 70) {
        return "#ff6600"
    } else if (depth < 90) {
        return "#ff0000"
    } else {
        return "#800000"
    }
};
// Create function for the earthquakeData to add features to the map 
function createFeatures(earthquakeData) {
    // Create a feature that makes circle sizes based on earthquake magnitude 
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Magnitude: ${feature.properties.mag}<h3><hr><p>Location: ${new Date(feature.properties.place)}</
        p>,p>Depth: ${(feature.geometry.coordinates[2])} km</p>`);
    }
    // geoJSON layer and marker formatting 
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng, {
                radius: feature.properties.mag * 4,
                fillOpacity: 0.8,
                stroke: true,
                color: 'white',
                weight: 1,
                fillColor: getColor(feature.geometry.coordinates[2])
            })
        }
    });
    // Map for earthquakes
    createMap(earthquakes);
}
// Function to add a new tile layer
function createMap(earthquakes) {
    //Create the base layers
    var gray = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {  
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        accessToken: API_KEY,
        id: "mapbox/streets-v11"
    });
    // Adding legend to the map
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend');
        labels = ['<strong>Depth of Epicenter</strong>'];
        example = [9, 15, 40, 60, 80, 99];
        categories = ['<10', '10-30', '30-50', '50-70', '70-90', '90+'];
        // Iterate through each magnitude item to label and color the legend
        // Push the labels arrary as list item
        for (var i = 0; i < categories.length; i++) {
            div.innerHTML +=
                labels.push(
                    '<i class = "circle" style = "background:' + getColor(example[i]) + '"></i> ' +
                    (categories[i] ? categories[i] : '+'));
        }
        // Joining the list of item to the div
        div.innerHTML = labels.join('<br>');
        return div;
    }
    // To make the map open in a specific location based on coordinates below
    var myMap = L.map("map", {
        center: [
            37.0902, -110.7129
        ],
        zoom: 5
    });
    // Additional map formatting
    gray.addTo(myMap);
    earthquakes.addTo(myMap);
    legend.addTo(myMap);
}