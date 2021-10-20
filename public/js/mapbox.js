/*eslint-disable */

const locations = JSON.parse(
  document.getElementById('map').dataset.locations //~data-locations
);

// console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoicGhhbW1taW5oZHVjaG4xNjEiLCJhIjoiY2t1emtlNHk2MTEzNDJwcXd5bmMyb2s2ayJ9.OWgWeOdkLX72jDVqZVRq_Q';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/phammminhduchn161/ckuzkumbv0wvq14p8m68ek8eq',
  scrollZoom: false
  // center: [-118.113491, 34.111745],
  // zoom: 10
});

//pass mapbox Ducpm123

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
  const el = document.createElement('div');
  el.className = 'marker';

  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  new mapboxgl.Popup({
    offset: 30
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>${loc.day} :${loc.description}</p>`)
    .addTo(map);

  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100
  }
});
