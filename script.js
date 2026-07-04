// Path to your CSV file 
const csvFilePath = "data56v3.csv"; // Ensure the correct path to your CSV file

let guests = []; // This will hold the parsed guest data

const searchBar = document.getElementById("search-bar");
const resultsBody = document.getElementById("results-body");

// Function to load CSV file
function loadCSV() {
  Papa.parse(csvFilePath, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      guests = results.data.map((guest) => ({
        name: guest.NAMA,       // Map 'NAMA' to 'name'
        name2: guest["NAMA PASANGAN"], // Map 'NAMA PASANGAN' to 'name2'
        id: guest.NO,
        seat: guest.MEJA,
        seat_no: guest.KEDUDUKAN,        // Map 'KEDUDUKAN' to 'seat_no'
        //seat_partner: guest["KEDUDUKAN PASANGAN"],
        menu: guest.MENU,
        menu_partner: guest["MENU PASANGAN"],
      }));
      console.log("CSV Loaded:", guests); // Debug: Log loaded data
    },
    error: function (error) {
      console.error("Error loading CSV:", error.message);
    },
  });
}

// Function to display results
function displayResults(filteredGuests) {
  resultsBody.innerHTML = ""; // Clear previous results

  if (filteredGuests.length > 0) {
    filteredGuests.forEach((guest) => {
      const table = document.createElement("table");
      table.className = "guest-table";

      let tableContent = "";
      if (guest.name) tableContent += `<tr><th>Nama</th><td>${guest.name}</td></tr>`;
      if (guest.id) tableContent += `<tr><th>No Tentera</th><td>${guest.id}</td></tr>`;
      if (guest.name2) tableContent += `<tr><th>Nama Pasangan</th><td>${guest.name2}</td></tr>`;
      if (guest.seat) tableContent += `<tr><th>Meja</th><td>${guest.seat}</td></tr>`;
      if (guest.seat_no) tableContent += `<tr><th>Meja Pasangan</th><td>${guest.seat_no}</td></tr>`;
      //if (guest.seat_partner) tableContent += `<tr><th>Meja Pasangan</th><td>${guest.seat_partner}</td></tr>`;

      table.innerHTML = tableContent;
      resultsBody.appendChild(table);
    });
  } else {
    resultsBody.innerHTML = "<p>No results found. Please try another ID or name.</p>";
  }
}

// Search event listener
searchBar.addEventListener("input", () => {
  const query = searchBar.value.toLowerCase().trim();

  if (!query) {
    resultsBody.innerHTML = "<p>Please enter a name or ID to search.</p>";
    return;
  }

  const filteredGuests = guests.filter(
    (guest) =>
      guest.id.toLowerCase() === query || // Full match for ID
    guest.name.toLowerCase().includes(query) || // Full phrase match in name
    guest.name.toLowerCase().split(" ").some((part) => part === query) || // Full word match in name
    guest.name2.toLowerCase().includes(query) || // Full phrase match in name
    guest.name2.toLowerCase().split(" ").some((part) => part === query)  // Full word match in name
  );

  displayResults(filteredGuests);
});

// === Menu Tag Color ===
function getMenuTag(menu) {
  if (!menu) return "-";
  const m = menu.toLowerCase();
  if (m.includes("ikan")) return `<span class="tag green">${menu}</span>`;
  if (m.includes("daging")) return `<span class="tag red">${menu}</span>`;
  if (m.includes("teh")) return `<span class="tag yellow">${menu}</span>`;
  if (m.includes("kopi")) return `<span class="tag blue">${menu}</span>`;
  return menu;
}

// === Countdown Timer ===
const eventDate = new Date("2026-07-05T20:00:00+08:00").getTime();
const countdownEl = document.getElementById("countdown");

function updateCountdown() {
  const now = new Date().getTime();
  const diff = eventDate - now;

  if (diff <= 0) {
    countdownEl.innerHTML = "<h3>🎉 Majlis telah bermula!</h3>";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById("days").innerText = days;
  document.getElementById("hours").innerText = hours;
  document.getElementById("minutes").innerText = mins;
  document.getElementById("seconds").innerText = secs;
}

//---------------------------------------------------------------------------------------

const music = document.getElementById("bgMusic");

let started = false;

async function startMusic() {
    if (started) return;
    started = true;

    try {
        await music.play();
        console.log("Music started");
    } catch (err) {
        console.error(err);
        started = false;
    }
}

document.addEventListener("pointerdown", startMusic, { passive: true });



//-----------------------------------------------------------------------------------------

setInterval(updateCountdown, 1000);

// --- Debug: Test CSV loading on Netlify ---
document.addEventListener("DOMContentLoaded", () => {
  fetch("data56v3.csv")
    .then(response => response.text())
    .then(csvText => {
      console.log("✅ CSV file fetched successfully");
      console.log(csvText.substring(0, 200)); // show first few lines
    })
    .catch(err => console.error("❌ Error fetching CSV file:", err));
});

// Load CSV on page load
document.addEventListener("DOMContentLoaded", loadCSV);
