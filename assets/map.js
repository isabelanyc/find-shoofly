function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 7,
    center: { lat: 40.2732, lng: -76.8867 } // center on Pennsylvania
  });

  fetch("assets/locations.json")
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
    .catch(err => console.error("Error loading locations:", err));
}
