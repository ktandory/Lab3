// Mapbox token set to access Mapbox API
mapboxgl.accessToken = 'pk.eyJ1Ijoia3RhbmRvcnkiLCJhIjoiY21rYmZhc2dqMDNqNzNlcHkwM2Z3cnAwMiJ9.GPIGSEiM53gRImZ-15RKkg'; // Add default public map token from your Mapbox account
const map = new mapboxgl.Map({
    container: 'my-map', // Map container ID
    style: 'mapbox://styles/ktandory/cmlg5w4sy004801qvae4m7p8q', // Custom style URL from Mapbox
    center: [-79.338, 43.713], // Starting position
    zoom: 11 // Zoom set to the neighborhood scale
});

// Map controls
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl());
const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  countries: "ca"
});
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

// Access and visualize data
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
                ['in', 'Architecture', ['get', 'interests']], '#0f6aa3',
                ['in', 'Art', ['get', 'interests']], '#6bb7e2',
                ['in', 'History', ['get', 'interests']], '#683b9b',
                ['in', 'Nature', ['get', 'interests']], '#dc88c5',
                ['in', 'Community', ['get', 'interests']], '#be0d22',
                ['in', 'Mural', ['get', 'interests']], '#288c1b',
                ['in', 'Culture', ['get', 'interests']], '#e3e356',
                ['in', 'Infrastructure', ['get', 'interests']], '#c15e0d',
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
            .setHTML("<b>Loup Tour Name:</b> " + e.features[0].properties.LoopTourName + "<br>" +
                "<b>Site name:</b>: " + e.features[0].properties.SiteName) // Use click event properties to write text for popup
            .addTo(map); // Show popup on map
    })

});