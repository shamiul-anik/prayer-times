// DOM Elements
const citySelect = document.getElementById('citySelect');
const countrySelect = document.getElementById('countrySelect');
const schoolSelect = document.getElementById('schoolSelect');
const prayerTimesContainer = document.getElementById('prayerTimesContainer');
const nextPrayerContainer = document.getElementById('nextPrayerContainer');
const locationInfo = document.getElementById('locationInfo');
const dateInfo = document.getElementById('dateInfo');
const currentTimeDisplay = document.getElementById('currentTime');
const adhanAudio = document.getElementById('adhanAudio');
const adhanStatus = document.getElementById('adhanStatus');

let currentPrayerTimes = {};
let lastPlayedPrayer = null;

// Utility function to escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Event Listeners
citySelect.addEventListener('change', loadPrayerTimes);
countrySelect.addEventListener('change', loadPrayerTimes);
schoolSelect.addEventListener('change', loadPrayerTimes);

document.addEventListener('DOMContentLoaded', () => {
  loadPrayerTimes();
  startClockUpdate();
  startAutoRefresh();
});

// Start updating current time every second
function startClockUpdate() {
  updateClock();
  setInterval(updateClock, 1000);
}

function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  if (currentTimeDisplay) {
    currentTimeDisplay.textContent = timeString;
  }
  checkPrayerTime();
}

// Auto refresh prayer times every 12 hours (43200000 ms)
function startAutoRefresh() {
  setInterval(loadPrayerTimes, 43200000);
}

// Load prayer times based on selected values
async function loadPrayerTimes() {
  try {
    const city = citySelect.value;
    const country = countrySelect.value;
    const school = schoolSelect.value;

    const response = await fetch(`/api/prayer-times?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&school=${school}`);
    const data = await response.json();
    
    console.log(data.test); // For Checking the API Response
    
    if (data.success) {
      currentPrayerTimes = data;
      displayPrayerTimes(data);
      displayNextPrayer(data);
      updateDateInfo(data);
      updateLocationInfo(data);
    } else {
      showError(prayerTimesContainer, data.error || 'Failed to load prayer times');
    }
  } catch (error) {
    console.error('Error loading prayer times:', error);
    showError(prayerTimesContainer, 'Error fetching prayer times. Please try again.');
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
  
  const html = prayers.map(prayer => `
    <div class="prayer-card ${nextPrayer && nextPrayer.name === prayer.name ? 'active' : ''}">
      <h3 class="prayer-name">${escapeHtml(prayer.name)}</h3>
      <p class="prayer-ar">${escapeHtml(prayer.ar)}</p>
      <div class="prayer-time">${escapeHtml(prayer.time)}</div>
    </div>
  `).join('');

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
        <div class="next-prayer-time">${escapeHtml(nextPrayer.time)}</div>
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
    const [hours, minutes] = prayer.time.split(':').map(Number);
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
  const [hours, minutes] = prayerTime.split(':').map(Number);
  
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
    return `${String(diffHours).padStart(2, '0')}:${String(diffMinutes).padStart(2, '0')}:${String(diffSeconds).padStart(2, '0')}`;
  } else if (diffMinutes > 0) {
    return `${String(diffMinutes).padStart(2, '0')}:${String(diffSeconds).padStart(2, '0')}`;
  } else {
    return `${String(diffSeconds).padStart(2, '0')}s`;
  }
}

// Check if current time matches prayer time and play Adhan
function checkPrayerTime() {
  if (!currentPrayerTimes.prayers) return;

  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

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
    adhanAudio.play().then(() => {
      updateAdhanStatus(`Playing Adhan for ${prayer.name} - ${prayer.time}`);
      console.log(`Adhan playing for ${prayer.name}`);
    }).catch(error => {
      console.error('Error playing Adhan:', error);
      updateAdhanStatus(`Ready to play Adhan for ${prayer.name}`);
    });
  } catch (error) {
    console.error('Error playing audio:', error);
    updateAdhanStatus('Adhan playback ready');
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
