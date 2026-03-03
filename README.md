# GGR472H1 Lab 3: Adding Styling and Interactivity to Web Maps with JavaScript
This repository contains code for a web map of cultural hotspots categorized by interest type across neighborhoods in Toronto.

Link to website:

## Repository Contents
`index.html`: HTML file to render web map containing the Mapbox container, bootstrap header, legend container, search container, dropdown filter, and
checkbox controls. Map interactivity is supported by linking HTML elements to JavaScript event listeners.

`script.js`: JavaScript file to initialize Mapbox map and implement interactivity, including styling GEOJSON point data, zoom-based symbology sizing,
classfied color styling, pop-up click events, layer filtering, creation of legend, and event handling of dropdown filter, checkboxes and full extent mode.

`style.css`: CSS file to style and position map overlay elements, including the header, legend, search and filter panels.

`points-of-interest - 4326.geojson`: GeoJSON dataset containing cultural hotspot point locations in Toronto. SiteName, Neighbourhood and Interests fields are
used for filtering and pop-up display.
