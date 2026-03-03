/*--------------------------------------------------------------------
INITIALISE MAP (using mapbox token set to access mapbox API)
--------------------------------------------------------------------*/
mapboxgl.accessToken = 'pk.eyJ1Ijoia3RhbmRvcnkiLCJhIjoiY21rYmZhc2dqMDNqNzNlcHkwM2Z3cnAwMiJ9.GPIGSEiM53gRImZ-15RKkg'; // Add default public map token from your Mapbox account
const map = new mapboxgl.Map({
    container: 'my-map', // Map container ID
    style: 'mapbox://styles/ktandory/cmlg5w4sy004801qvae4m7p8q', // Custom style URL from Mapbox
    center: [-79.338, 43.713], // Starting position
    zoom: 11
});

/*--------------------------------------------------------------------
MAP CONTROLS
--------------------------------------------------------------------*/
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl());
const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  countries: "ca"
});
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

/*--------------------------------------------------------------------
ACCESS AND VISUALIZE DATA
--------------------------------------------------------------------*/
map.on('load', () => {
    map.addSource('Cultural_Hotspots', {
        type: 'geojson',
        data: 'points-of-interest - 4326.geojson'
    });

    // Cultural hotspots with classified styling and zoom-based sizes
    map.addLayer({
        'id': 'Cultural_Hotspots_Points',
        'type': 'circle',
        'source': 'Cultural_Hotspots',
        'paint': {
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                8, 1,
                12, 10,
                16, 14
            ],
            'circle-color': [
                'case',
                ['in', 'Architecture', ['get', 'Interests']], '#0f6aa3',
                ['in', 'Art', ['get', 'Interests']], '#6bb7e2',
                ['in', 'History', ['get', 'Interests']], '#683b9b',
                ['in', 'Nature', ['get', 'Interests']], '#dc88c5',
                ['in', 'Community', ['get', 'Interests']], '#be0d22',
                ['in', 'Mural', ['get', 'Interests']], '#288c1b',
                ['in', 'Culture', ['get', 'Interests']], '#e3e356',
                ['in', 'Infrastructure', ['get', 'Interests']], '#c15e0d',
                '#999999' // default if none found
            ],
            'circle-opacity': 0.85,
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 1
        }
    });

    // Add pop-up click event
    map.on('mouseenter', 'Cultural_Hotspots_Points', () => {
        map.getCanvas().style.cursor = 'pointer'; // Switches cursor to pointer when mouse is over cultural hotspots points layer
    });

    map.on('mouseleave', 'Cultural_Hotspots_Points', () => {
        map.getCanvas().style.cursor = ''; // Switches cursors back when mouse leaves cultural hotspots points layer
    });
    
    map.on('click', 'Cultural_Hotspots_Points', (e) => {
        new mapboxgl.Popup() // Declare new popup object on each click
            .setLngLat(e.lngLat) // Use method to set coordinates of popup based on mouse click location
            .setHTML("<b>Site Name:</b> " + e.features[0].properties.SiteName + "<br>" +
                "<b>Neighbourhood:</b>: " + e.features[0].properties.Neighbourhood + "<br>" +
                "<b>Interests:</b>: " + e.features[0].properties.Interests
            ) // Use click event properties to write text for popup
            .addTo(map); // Show popup on map
    })

});

/*--------------------------------------------------------------------
CREATE LEGEND -- Based on week 8 demo 2
--------------------------------------------------------------------*/
// Array variables defined for labels and colors
const legenditems = [
  { label: 'Architecture', colour: '#0f6aa3' },
  { label: 'Art', colour: '#6bb7e2' },
  { label: 'History', colour: '#683b9b' },
  { label: 'Nature', colour: '#dc88c5' },
  { label: 'Community', colour: '#be0d22' },
  { label: 'Mural', colour: '#288c1b' },
  { label: 'Culture', colour: '#e3e356' },
  { label: 'Infrastructure', colour: '#c15e0d' },
  { label: 'Other/Unknown', colour: '#999999' }
];

//Create row to put the label and color in for each array item
legenditems.forEach(({ label, colour }) => {
  const row = document.createElement('div'); // Each item gets a 'row' as a div

  const colcircle = document.createElement('span'); // Create span for each color circle
  colcircle.className = 'legend-colcircle'; // colcircle will assume the shape and style properties defined in CSS
  colcircle.style.setProperty('--legendcolour', colour); // A custom property takes the color from the array and applies it to the CSS class

  const text = document.createElement('span'); // Create span for label text
  text.textContent = label;  // Set text variable to legend value in array

  row.append(colcircle, text); // Add circle and text to legend row
  legend.appendChild(row); // Add row to legend container
});

/*--------------------------------------------------------------------
ADD INTERACTIVITY BASED ON HTML EVENT
--------------------------------------------------------------------*/
//Event Listener added to return map view to fullscreen on button click using flyTo method
document.getElementById('returnbutton').addEventListener('click', () => {
    map.flyTo({
        center: [-79.338, 43.713],
        zoom: 11,
        essential: true
    });
});

//Change legend display (show/hide) based on checkbox
let legendcheck = document.getElementById('legendcheck');

legendcheck.addEventListener('click', () => {
    if (legendcheck.checked) {
        legendcheck.checked = true;
        legend.style.display = 'block';
    }
    else {
        legend.style.display = "none";
        legendcheck.checked = false;
    }
});

//Change map layer display based on checkbox using setLayoutProperty method
document.getElementById('layercheck').addEventListener('change', (e) => {
    map.setLayoutProperty(
        'Cultural_Hotspots_Points',
        'visibility',
        e.target.checked ? 'visible' : 'none'
    );
});

//Filter 'Interest' data layer to show selected Interest from dropdown selection
let interestvalue;

document.getElementById("interestfieldset").addEventListener('change', (e) => {   
    interestvalue = document.getElementById('interest').value;

    //console.log(boundaryvalue); // Useful for testing whether correct values are returned from dropdown selection

    if (interestvalue == 'All') {
        map.setFilter(
            'Cultural_Hotspots_Points', ['has', 'Interests'] // Returns all points from layer that have a value in interest field
        );
    } else {
        map.setFilter(
            'Cultural_Hotspots_Points',
            ['in', interestvalue, ['get', 'Interests']] // returns points that contain the selected interest value
        );
    }
});