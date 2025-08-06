/*
 * list.js
 *
 * Loads the locations data and renders it into a table with simple search
 * and filter capabilities. The page must include inputs with ids
 * `search-input`, `state-filter` and `type-filter`, a button with id
 * `apply-list-filter`, and a table with id `locations-table`.
 */

let allLocations = [];

document.addEventListener('DOMContentLoaded', () => {
  // Fetch the location data once the DOM is ready
  fetch('locations.json')
    .then((resp) => resp.json())
    .then((data) => {
      allLocations = data;
      populateStateFilter();
      renderTable(allLocations);
    })
    .catch((err) => {
      console.error('Failed to load locations:', err);
    });

  // Attach event listener for filter button
  const filterBtn = document.getElementById('apply-list-filter');
  filterBtn.addEventListener('click', () => {
    applyListFilter();
  });
});

/**
 * Populate the state filter select with all unique state codes in the
 * dataset.
 */
function populateStateFilter() {
  const stateSelect = document.getElementById('state-filter');
  stateSelect.innerHTML = '';
  const allOpt = document.createElement('option');
  allOpt.value = '';
  allOpt.textContent = 'All';
  stateSelect.appendChild(allOpt);
  const states = Array.from(new Set(allLocations.map((loc) => loc.state))).sort();
  states.forEach((state) => {
    const opt = document.createElement('option');
    opt.value = state;
    opt.textContent = state;
    stateSelect.appendChild(opt);
  });
}

/**
 * Render the provided list of locations into the table body.
 * @param {Array} list Array of location objects
 */
function renderTable(list) {
  const tbody = document.querySelector('#locations-table tbody');
  tbody.innerHTML = '';
  list.forEach((loc) => {
    const tr = document.createElement('tr');
    // Name
    const nameTd = document.createElement('td');
    nameTd.textContent = loc.name;
    tr.appendChild(nameTd);
    // City
    const cityTd = document.createElement('td');
    cityTd.textContent = loc.city;
    tr.appendChild(cityTd);
    // State
    const stateTd = document.createElement('td');
    stateTd.textContent = loc.state;
    tr.appendChild(stateTd);
    // Style
    const typeTd = document.createElement('td');
    typeTd.textContent =
      loc.type.charAt(0).toUpperCase() + loc.type.slice(1) + ' bottom';
    tr.appendChild(typeTd);
    // Address
    const addrTd = document.createElement('td');
    addrTd.textContent = loc.address;
    tr.appendChild(addrTd);
    // Website
    const webTd = document.createElement('td');
    if (loc.website) {
      const link = document.createElement('a');
      link.href = loc.website;
      link.textContent = 'Visit';
      link.target = '_blank';
      link.rel = 'noopener';
      webTd.appendChild(link);
    }
    tr.appendChild(webTd);
    tbody.appendChild(tr);
  });
}

/**
 * Apply the search and filter selections to the data and re‑render the table.
 */
function applyListFilter() {
  const term = document
    .getElementById('search-input')
    .value.trim()
    .toLowerCase();
  const state = document.getElementById('state-filter').value;
  const type = document.getElementById('type-filter').value;
  const filtered = allLocations.filter((loc) => {
    const matchTerm = !term || loc.name.toLowerCase().includes(term);
    const matchState = !state || loc.state === state;
    const matchType = !type || loc.type === type;
    return matchTerm && matchState && matchType;
  });
  renderTable(filtered);
}