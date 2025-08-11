(function() {
  if (typeof GOOGLE_MAPS_API_KEY === 'undefined' || !GOOGLE_MAPS_API_KEY) {
    console.error('Google Maps API key not set. Please create assets/config.js with your key.');
    return;
  }
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
})();

function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: { lat: 40.2732, lng: -76.8867 }
  });

  fetch('assets/locations.json')
    .then(response => response.json())
    .then(data => {
      data.forEach(loc => {
        new google.maps.Marker({
          position: { lat: loc.latitude, lng: loc.longitude },
          map,
          title: loc.name
        });
      });
    })
    .catch(err => console.error('Error loading locations:', err));
}

window.initMap = initMap;
