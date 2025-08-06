/*
 * map.js
 *
 * Handles loading location data, populating filter controls and rendering
 * markers on a Leaflet map. This script expects there to be a div with the
 * id `map` in the page and select elements with ids `state-select`,
 * `city-select` and `type-select`. A button with id `apply-filter` triggers
 * filtering.
 */

// Global variables to hold map instance, raw data and marker layer group
let map;
let locations = [];
let markersLayer;

// Initialise the map and fetch data when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Create the map with a default centre over Lancaster County
  map = L.map('map').setView([40.05, -76.18], 9);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  markersLayer = L.layerGroup().addTo(map);

  // Load the location data
  fetch('locations.json')
    .then((resp) => resp.json())
    .then((data) => {
      locations = data;
      populateStateOptions();
      populateCityOptions();
      renderMarkers(locations);
    })
    .catch((err) => {
      console.error('Failed to load locations:', err);
    });

  // Wire up filter button
  const applyBtn = document.getElementById('apply-filter');
  applyBtn.addEventListener('click', () => {
    applyFilter();
  });

  // Update city options when state changes
  const stateSelect = document.getElementById('state-select');
  stateSelect.addEventListener('change', () => {
    populateCityOptions();
  });
});

/**
 * Populate the state select with unique state codes from the data.
 */
function populateStateOptions() {
  const stateSelect = document.getElementById('state-select');
  // Clear existing options
  stateSelect.innerHTML = '';
  const allOption = document.createElement('option');
  allOption.value = '';
  allOption.textContent = 'All';
  stateSelect.appendChild(allOption);
  // Build a set of unique states
  const states = Array.from(new Set(locations.map((loc) => loc.state))).sort();
  states.forEach((state) => {
    const opt = document.createElement('option');
    opt.value = state;
    opt.textContent = state;
    stateSelect.appendChild(opt);
  });
}

/**
 * Populate the city select based on the selected state. If no state is
 * selected, show all unique cities.
 */
function populateCityOptions() {
  const citySelect = document.getElementById('city-select');
  const state = document.getElementById('state-select').value;
  citySelect.innerHTML = '';
  const allOption = document.createElement('option');
  allOption.value = '';
  allOption.textContent = 'All';
  citySelect.appendChild(allOption);
  let cities;
  if (state) {
    cities = Array.from(
      new Set(
        locations
          .filter((loc) => loc.state === state)
          .map((loc) => loc.city)
      )
    );
  } else {
    cities = Array.from(new Set(locations.map((loc) => loc.city)));
  }
  cities.sort().forEach((city) => {
    const opt = document.createElement('option');
    opt.value = city;
    opt.textContent = city;
    citySelect.appendChild(opt);
  });
}

/**
 * Render markers for the provided location list. Clears any existing markers
 * before adding new ones.
 * @param {Array} list Array of location objects
 */
function renderMarkers(list) {
  markersLayer.clearLayers();
  if (list.length === 0) {
    return;
  }
  const bounds = [];
  list.forEach((loc) => {
    if (typeof loc.latitude === 'number' && typeof loc.longitude === 'number') {
      const marker = L.marker([loc.latitude, loc.longitude]);
      marker.bindPopup(
        `<strong>${loc.name}</strong><br>${loc.city}, ${loc.state}<br>` +
          `${loc.type.charAt(0).toUpperCase() + loc.type.slice(1)} bottom`
      );
      marker.addTo(markersLayer);
      bounds.push([loc.latitude, loc.longitude]);
    }
  });
  if (bounds.length > 0) {
    const latLngBounds = L.latLngBounds(bounds);
    map.fitBounds(latLngBounds.pad(0.1));
  }
}

/**
 * Apply the selected filters and re‑render the markers.
 */
function applyFilter() {
  const state = document.getElementById('state-select').value;
  const city = document.getElementById('city-select').value;
  const type = document.getElementById('type-select').value;
  const filtered = locations.filter((loc) => {
    const matchState = !state || loc.state === state;
    const matchCity = !city || loc.city === city;
    const matchType = !type || loc.type === type;
    return matchState && matchCity && matchType;
  });
  renderMarkers(filtered);
}