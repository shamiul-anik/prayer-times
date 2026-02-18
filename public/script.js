// DOM Elements
const citySelect = document.getElementById("citySelect");
const countrySelect = document.getElementById("countrySelect");
const schoolSelect = document.getElementById("schoolSelect");
const timingSelect = document.getElementById("timingSelect");
const prayerTimesContainer = document.getElementById("prayerTimesContainer");
const nextPrayerContainer = document.getElementById("nextPrayerContainer");
const locationInfo = document.getElementById("locationInfo");
const dateInfo = document.getElementById("dateInfo");
const currentTimeDisplay = document.getElementById("currentTime");
const adhanAudio = document.getElementById("adhanAudio");
const adhanStatus = document.getElementById("adhanStatus");

let currentPrayerTimes = {};
let lastPlayedPrayer = null;

// Define city-country mapping
const cityCountryMap = {
  Japan: ["Osaka", "Tokyo"],
  UK: ["London"],
  UAE: ["Dubai"],
  Turkey: ["Istanbul"],
  Egypt: ["Cairo"],
  "Saudi Arabia": ["Medina", "Mecca"],
};

// Function to update city options based on selected country
function updateCityOptions() {
  const selectedCountry = countrySelect.value;
  const cities = cityCountryMap[selectedCountry] || [];

  // Clear existing city options
  citySelect.innerHTML = "";

  // Add new city options
  cities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
  });

  // Select the first city or a previously saved one
  const savedCity = localStorage.getItem("prayer-times-city");
  if (savedCity && cities.includes(savedCity)) {
    citySelect.value = savedCity;
  } else if (cities.length > 0) {
    citySelect.value = cities[0];
  }
}

// Get cache key with date to ensure daily refresh
function getCacheKey(city, country, school) {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  return `prayer-times-${city}-${country}-${school}-${today}`;
}

// Utility function to escape HTML
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Utility function to format time based on selected format
function formatTime(time24) {
  const format = timingSelect && timingSelect.value ? timingSelect.value : "24";
  const [hours, minutes] = time24.split(":").map(Number);

  if (format === "12") {
    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    return `${String(hour12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
  }
  return time24; // 24-hour format
}

// Event Listeners
citySelect.addEventListener("change", () => {
  localStorage.setItem("prayer-times-city", citySelect.value);
  loadPrayerTimes();
});
countrySelect.addEventListener("change", () => {
  localStorage.setItem("prayer-times-country", countrySelect.value);
  updateCityOptions();
  loadPrayerTimes();
});
schoolSelect.addEventListener("change", () => {
  localStorage.setItem("prayer-times-school", schoolSelect.value);
  loadPrayerTimes();
});

// Add event listener for timing select if element exists
if (timingSelect) {
  timingSelect.addEventListener("change", () => {
    // Save timing preference to localStorage
    localStorage.setItem("prayer-times-timing", timingSelect.value);

    if (Object.keys(currentPrayerTimes).length > 0) {
      displayPrayerTimes(currentPrayerTimes);
      displayNextPrayer(currentPrayerTimes);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Restore timing preference from localStorage
  if (timingSelect && localStorage.getItem("prayer-times-timing")) {
    timingSelect.value = localStorage.getItem("prayer-times-timing");
  }

  // Restore country preference from localStorage
  if (countrySelect && localStorage.getItem("prayer-times-country")) {
    countrySelect.value = localStorage.getItem("prayer-times-country");
  }

  // Restore school preference from localStorage
  if (schoolSelect && localStorage.getItem("prayer-times-school")) {
    schoolSelect.value = localStorage.getItem("prayer-times-school");
  }

  updateCityOptions(); // Initialize city options based on selected country

  // Restore city preference from localStorage after options are updated
  if (citySelect && localStorage.getItem("prayer-times-city")) {
    citySelect.value = localStorage.getItem("prayer-times-city");
  }

  loadPrayerTimes();
  startClockUpdate();
  startAutoRefresh();
  initRamadanTimetable();
});

// Ramadan Timetable Logic
function initRamadanTimetable() {
  const container = document.getElementById("RamadanHighlightContainer");
  const tableBody = document.getElementById("RamadanFullTableBody");
  const highlightSection = document.getElementById("RamadanHighlightSection");
  const fullSection = document.getElementById("RamadanFullSection");
  const highlightTitle = document.getElementById("RamadanHighlightTitle");

  if (!RamadanTimetable2026 || RamadanTimetable2026.length === 0) return;

  // Populate Full Timetable
  tableBody.innerHTML = RamadanTimetable2026
    .map(
      (day) => `
    <tr class="${isCurrentRamadanDay(day) ? "current-day" : ""}">
      <td>${day.Day}</td>
      <td>${day.Date}</td>
      <td>${day["Suhoor End"]}</td>
      <td>${day.Fajr}</td>
      <td>${day.Sunrise}</td>
      <td>${day.Zuhr}</td>
      <td>${day.Ashar}</td>
      <td>${day.Maghrib}</td>
      <td>${day["Iftar Start"]}</td>
      <td>${day.Isha}</td>
    </tr>
  `,
    )
    .join("");
  fullSection.style.display = "block";

  // Find and Populate Current Day Highlight
  const currentDay = findCurrentRamadanDay();
  if (currentDay) {
    highlightTitle.textContent = `Ramadan Timetable 2026 - Osaka, Japan (Date ${currentDay.Date})`;
    container.innerHTML = `
      <div class="Ramadan-item">
        <div class="Ramadan-item-label">Day</div>
        <div class="Ramadan-item-value">${currentDay.Day}</div>
      </div>
      <div class="Ramadan-item">
        <div class="Ramadan-item-label">Date</div>
        <div class="Ramadan-item-value">${currentDay.Date}</div>
      </div>
      <div class="Ramadan-item">
        <div class="Ramadan-item-label">Suhoor End</div>
        <div class="Ramadan-item-value">${currentDay["Suhoor End"]}</div>
      </div>
      <div class="Ramadan-item">
        <div class="Ramadan-item-label">Fajr</div>
        <div class="Ramadan-item-value">${currentDay.Fajr}</div>
      </div>
      <div class="Ramadan-item">
        <div class="Ramadan-item-label">Maghrib</div>
        <div class="Ramadan-item-value">${currentDay.Maghrib}</div>
      </div>
      <div class="Ramadan-item">
        <div class="Ramadan-item-label">Iftar Start</div>
        <div class="Ramadan-item-value">${currentDay["Iftar Start"]}</div>
      </div>
    `;
    highlightSection.style.display = "block";
  }
}

function findCurrentRamadanDay() {
  const now = new Date();
  const day = now.getDate();
  const month = now.toLocaleString("en-US", { month: "long" });
  const monthShort = now.toLocaleString("en-US", { month: "short" });

  return RamadanTimetable2026.find((item) => {
    return (
      item.Date.includes(`${day} ${month}`) ||
      item.Date.includes(`${day} ${monthShort}`)
    );
  });
}

function isCurrentRamadanDay(dayObj) {
  const current = findCurrentRamadanDay();
  return current && current.Day === dayObj.Day;
}

// Start updating current time every second
function startClockUpdate() {
  updateClock();
  setInterval(updateClock, 1000);
}

function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  if (currentTimeDisplay) {
    currentTimeDisplay.textContent = timeString;
  }
  checkPrayerTime();
}

// Clear old cache entries (from previous days)
function clearOldCache() {
  const today = new Date().toISOString().split("T")[0];
  const keysToDelete = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("prayer-times-")) {
      // Extract date from cache key (format: prayer-times-city-country-school-YYYY-MM-DD)
      const parts = key.split("-");
      const cacheDate = parts.slice(-3).join("-"); // Get last 3 parts (YYYY-MM-DD)

      if (cacheDate !== today) {
        keysToDelete.push(key);
      }
    }
  }

  keysToDelete.forEach((key) => {
    localStorage.removeItem(key);
  });

  if (keysToDelete.length > 0) {
    console.log(`✓ Cleared ${keysToDelete.length} old cache entries`);
  }
}

// Auto refresh prayer times every 12 hours (43200000 ms)
function startAutoRefresh() {
  // Clear old cache every hour
  setInterval(clearOldCache, 60 * 60 * 1000); // Every hour

  // Refresh prayer times every 12 hours
  setInterval(loadPrayerTimes, 12 * 60 * 60 * 1000);
}

// Load prayer times based on selected values
async function loadPrayerTimes() {
  try {
    const city = citySelect.value;
    const country = countrySelect.value;
    const school = schoolSelect.value;

    // Show loading state
    showLoadingState();

    // Try to use cached data first
    const cacheKey = getCacheKey(city, country, school);
    const cachedData = localStorage.getItem(cacheKey);

    // Use cache if available (cache is daily, so it's always fresh for the current day)
    if (cachedData) {
      try {
        const data = JSON.parse(cachedData);
        if (data && data.prayers && data.prayers.length > 0) {
          currentPrayerTimes = data;
          displayPrayerTimes(data);
          displayNextPrayer(data);
          updateDateInfo(data);
          updateLocationInfo(data);

          // Fetch fresh data in background to keep it updated
          fetchPrayerTimesInBackground(city, country, school, cacheKey);
          return;
        }
      } catch (error) {
        console.error("Error parsing cached data:", error);
        // Continue to fetch fresh data
      }
    }

    // No valid cache, fetch from API
    const response = await fetch(
      `/api/prayer-times?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&school=${school}`,
    );
    const data = await response.json();

    if (data.success) {
      // Cache the data
      localStorage.setItem(cacheKey, JSON.stringify(data));
      localStorage.setItem(cacheKey + "-time", Date.now().toString());

      currentPrayerTimes = data;
      displayPrayerTimes(data);
      displayNextPrayer(data);
      updateDateInfo(data);
      updateLocationInfo(data);
    } else {
      showError(
        prayerTimesContainer,
        data.error || "Failed to load prayer times",
      );
    }
  } catch (error) {
    console.error("Error loading prayer times:", error);

    // Try to show cached data if network fails
    const city = citySelect.value;
    const country = countrySelect.value;
    const school = schoolSelect.value;
    const cacheKey = getCacheKey(city, country, school);
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      const data = JSON.parse(cachedData);
      currentPrayerTimes = data;
      displayPrayerTimes(data);
      displayNextPrayer(data);
      updateDateInfo(data);
      updateLocationInfo(data);
    } else {
      showError(
        prayerTimesContainer,
        "Error fetching prayer times. Please check your connection.",
      );
    }
  }
}

// Fetch prayer times in background without blocking UI
async function fetchPrayerTimesInBackground(city, country, school, cacheKey) {
  try {
    const response = await fetch(
      `/api/prayer-times?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&school=${school}`,
    );
    const data = await response.json();

    if (data && data.success && data.prayers && data.prayers.length > 0) {
      // Validate data before caching
      const existingCache = localStorage.getItem(cacheKey);
      const newDataString = JSON.stringify(data);

      // Only update if we have new/different data
      if (!existingCache || newDataString !== existingCache) {
        localStorage.setItem(cacheKey, newDataString);
        console.log("✓ Prayer times cache updated");

        // Update current display if data has changed significantly
        if (existingCache) {
          const oldData = JSON.parse(existingCache);
          if (
            JSON.stringify(oldData.prayers) !== JSON.stringify(data.prayers)
          ) {
            currentPrayerTimes = data;
            displayPrayerTimes(data);
            displayNextPrayer(data);
          }
        }
      }
    }
  } catch (error) {
    console.error("Background fetch error:", error);
    // Silent fail - we already have cached data
  }
}

// Show loading state
function showLoadingState() {
  if (prayerTimesContainer) {
    prayerTimesContainer.innerHTML = `
      <div style="text-align: center; padding: 30px;">
        <div style="font-size: 24px; margin-bottom: 15px;">⏳</div>
        <p>Loading prayer times...</p>
      </div>
    `;
  }
}

// Update location information
function updateLocationInfo(data) {
  if (locationInfo) {
    locationInfo.textContent = `in ${data.city}, ${data.country}`;
  }
}

// Update date information
function updateDateInfo(data) {
  if (dateInfo) {
    dateInfo.innerHTML = `
    <div>${data.gregorianDate.weekday.en}, ${data.gregorianDate.month.en} ${data.gregorianDate.day}, ${data.gregorianDate.year} [${data.gregorianDate.date} AD]</div>
    <div>${data.hijriDate.weekday.en} (${data.hijriDate.weekday.ar}), ${data.hijriDate.day} ${data.hijriDate.month.en} (${data.hijriDate.month.ar}), ${data.hijriDate.year} [${data.hijriDate.date} AH]</div>
    `;
  }
}

// Display prayer times
function displayPrayerTimes(data) {
  const prayers = data.prayers;
  const nextPrayer = getNextPrayer(prayers);

  const html = prayers
    .map(
      (prayer) => `
    <div class="prayer-card ${nextPrayer && nextPrayer.name === prayer.name ? "active" : ""}">
      <h3 class="prayer-name">${escapeHtml(prayer.name)}</h3>
      <p class="prayer-ar">${escapeHtml(prayer.ar)}</p>
      <div class="prayer-time">${escapeHtml(formatTime(prayer.time))}</div>
    </div>
  `,
    )
    .join("");

  prayerTimesContainer.innerHTML = html;
}

// Display next prayer
function displayNextPrayer(data) {
  const nextPrayer = getNextPrayer(data.prayers);

  if (nextPrayer) {
    const timeRemaining = calculateTimeRemaining(nextPrayer.time);

    const html = `
      <div class="next-prayer-content">
        <div class="next-prayer-label">Upcoming Prayer</div>
        <div class="next-prayer-name">${escapeHtml(nextPrayer.name)}</div>
        <div class="next-prayer-ar">${escapeHtml(nextPrayer.ar)}</div>
        <div class="next-prayer-time">${escapeHtml(formatTime(nextPrayer.time))}</div>
        <div class="time-remaining">
          <span>${escapeHtml(timeRemaining)}</span>
        </div>
      </div>
    `;

    nextPrayerContainer.innerHTML = html;
  }
}

// Get next prayer from prayer list
function getNextPrayer(prayers) {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  for (const prayer of prayers) {
    const [hours, minutes] = prayer.time.split(":").map(Number);
    const prayerTime = hours * 60 + minutes;

    if (prayerTime > currentTime) {
      return prayer;
    }
  }

  // If no prayer found today, return first prayer (Fajr tomorrow)
  return prayers[0];
}

// Calculate time remaining until next prayer
function calculateTimeRemaining(prayerTime) {
  const now = new Date();
  const [hours, minutes] = prayerTime.split(":").map(Number);

  const prayerDate = new Date();
  prayerDate.setHours(hours, minutes, 0);

  // If prayer time has passed, add one day
  if (prayerDate <= now) {
    prayerDate.setDate(prayerDate.getDate() + 1);
  }

  const diff = prayerDate - now;
  const diffHours = Math.floor(diff / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const diffSeconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (diffHours > 0) {
    return `${String(diffHours).padStart(2, "0")}:${String(diffMinutes).padStart(2, "0")}:${String(diffSeconds).padStart(2, "0")}`;
  } else if (diffMinutes > 0) {
    return `${String(diffMinutes).padStart(2, "0")}:${String(diffSeconds).padStart(2, "0")}`;
  } else {
    return `${String(diffSeconds).padStart(2, "0")}s`;
  }
}

// Check if current time matches prayer time and play Adhan
function checkPrayerTime() {
  if (!currentPrayerTimes.prayers) return;

  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  for (const prayer of currentPrayerTimes.prayers) {
    if (prayer.time === currentTime && lastPlayedPrayer !== prayer.name) {
      lastPlayedPrayer = prayer.name;
      playAdhan(prayer);
    }
  }
}

// Play Adhan
function playAdhan(prayer) {
  try {
    adhanAudio.currentTime = 0;
    adhanAudio
      .play()
      .then(() => {
        updateAdhanStatus(`Playing Adhan for ${prayer.name} - ${prayer.time}`);
        console.log(`Adhan playing for ${prayer.name}`);

        // Send PWA notification
        if (window.pwaInstance) {
          window.pwaInstance.showPrayerNotification(prayer);
        }
      })
      .catch((error) => {
        console.error("Error playing Adhan:", error);
        updateAdhanStatus(`Ready to play Adhan for ${prayer.name}`);

        // Still send notification even if audio fails
        if (window.pwaInstance) {
          window.pwaInstance.showPrayerNotification(prayer);
        }
      });
  } catch (error) {
    console.error("Error playing audio:", error);
    updateAdhanStatus("Adhan playback ready");
  }
}

function updateAdhanStatus(message) {
  if (adhanStatus) {
    adhanStatus.textContent = message;
  }
}

// Show error message
function showError(container, message) {
  container.innerHTML = `<div class="error">${escapeHtml(message)}</div>`;
}
