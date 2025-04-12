var map = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL', // stylesheet location
    center: listing.geomentry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});


// add markekr 
const marker = new maplibregl.Marker({color: "red", draggable: true})
    .setLngLat(listing.geomentry.coordinates)
    .setPopup(new maplibregl.Popup({offset: 35 }).setHTML(`<h4>${listing.location}</h4><p>Exact Location of Listing</p>`))
    .addTo(map);

// add zoom and rotate controls
map.addContrl(new maplibregl.NavigationControl());
