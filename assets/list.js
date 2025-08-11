let shooflyData = [];

function populateTable(data) {
  const tbody = document.querySelector("#shoofly-table tbody");
  tbody.innerHTML = "";

  data.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name || "N/A"}</td>
      <td>${item.city || "N/A"}</td>
      <td>${item.state || "N/A"}</td>
      <td>${item.type || "Unknown"}</td>
    `;
    tbody.appendChild(row);
  });
}

function populateFilters() {
  const states = [...new Set(shooflyData.map(item => item.state).filter(Boolean))].sort();
  const cities = [...new Set(shooflyData.map(item => item.city).filter(Boolean))].sort();
  const styles = [...new Set(shooflyData.map(item => item.type).filter(Boolean))].sort();

  const stateFilter = document.getElementById("state-filter");
  const cityFilter = document.getElementById("city-filter");
  const styleFilter = document.getElementById("style-filter");

  // Clear existing options except "All"
  [stateFilter, cityFilter, styleFilter].forEach(select => {
    select.innerHTML = `<option>All</option>`;
  });

  states.forEach(state => {
    const option = document.createElement("option");
    option.value = state;
    option.textContent = state;
    stateFilter.appendChild(option);
  });

  cities.forEach(city => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    cityFilter.appendChild(option);
  });

  styles.forEach(style => {
    const option = document.createElement("option");
    option.value = style;
    option.textContent = style;
    styleFilter.appendChild(option);
  });
}

function applyFilters() {
  const stateValue = document.getElementById("state-filter").value;
  const cityValue = document.getElementById("city-filter").value;
  const styleValue = document.getElementById("style-filter").value;

  let filteredData = shooflyData;

  if (stateValue !== "All") {
    filteredData = filteredData.filter(item => item.state === stateValue);
  }
  if (cityValue !== "All") {
    filteredData = filteredData.filter(item => item.city === cityValue);
  }
  if (styleValue !== "All") {
    filteredData = filteredData.filter(item => item.type === styleValue);
  }

  populateTable(filteredData);
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("assets/locations.json")
    .then(response => response.json())
    .then(data => {
      shooflyData = data;
      populateTable(shooflyData);
      populateFilters();

      document.getElementById("state-filter").addEventListener("change", applyFilters);
      document.getElementById("city-filter").addEventListener("change", applyFilters);
      document.getElementById("style-filter").addEventListener("change", applyFilters);
    })
    .catch(error => console.error("Error loading locations.json:", error));
});
