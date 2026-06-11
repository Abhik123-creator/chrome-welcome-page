// DOM Elements
const clockDisplay = document.getElementById('clock-display');
const clockSeconds = document.getElementById('clock-seconds');
const dateDisplay = document.getElementById('current-date');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const engineRadios = document.querySelectorAll('input[name="engine"]');

// Search Engines Dictionary
const engines = {
  google: 'https://www.google.com/search?q=',
  duck: 'https://duckduckgo.com/?q=',
  bing: 'https://www.bing.com/search?q=',
  brave: 'https://search.brave.com/search?q=',
  youtube: 'https://www.youtube.com/results?search_query='
};

// Update Clock
function updateClock() {
  const now = new Date();
  
  // Format hours and minutes
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  clockDisplay.textContent = `${hours}:${minutes}`;
  
  // Format seconds
  const seconds = now.getSeconds().toString().padStart(2, '0');
  clockSeconds.textContent = `:${seconds}`;

  // Format Date: Thu, Jun 11
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  dateDisplay.textContent = now.toLocaleDateString('en-US', options);
}

// Initial clock call and interval
updateClock();
setInterval(updateClock, 1000);

// Search Handling
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  
  if (!query) return;

  // Find selected engine
  let selectedEngine = 'google'; // Default
  for (const radio of engineRadios) {
    if (radio.checked) {
      selectedEngine = radio.value;
      break;
    }
  }

  // Build URL and redirect
  const searchUrl = engines[selectedEngine] + encodeURIComponent(query);
  window.location.href = searchUrl;
});

// Weather Integration
const weatherDesc = document.getElementById('weather-desc');
const weatherIcon = document.getElementById('weather-icon');
const weatherHumidity = document.getElementById('weather-humidity');
const weatherFeels = document.getElementById('weather-feels');
const weatherLocation = document.getElementById('weather-location');
const weatherTemp = document.getElementById('weather-temp');

const API_KEY = '4fd40b05f58e2f78fc00ed956b577b1d';

// Map OpenWeather icon codes to Phosphor icons
const iconMap = {
  '01d': 'ph-sun', '01n': 'ph-moon',
  '02d': 'ph-cloud-sun', '02n': 'ph-cloud-moon',
  '03d': 'ph-cloud', '03n': 'ph-cloud',
  '04d': 'ph-cloud', '04n': 'ph-cloud',
  '09d': 'ph-cloud-rain', '09n': 'ph-cloud-rain',
  '10d': 'ph-cloud-sun-rain', '10n': 'ph-cloud-moon-rain',
  '11d': 'ph-cloud-lightning', '11n': 'ph-cloud-lightning',
  '13d': 'ph-snowflake', '13n': 'ph-snowflake',
  '50d': 'ph-cloud-fog', '50n': 'ph-cloud-fog'
};

function fetchWeather(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      weatherDesc.textContent = data.weather[0].main.toUpperCase();
      const iconCode = data.weather[0].icon;
      weatherIcon.className = `ph ${iconMap[iconCode] || 'ph-cloud'}`;
      weatherHumidity.textContent = `Humidity ${data.main.humidity}%`;
      weatherFeels.textContent = `Feels ${Math.round(data.main.feels_like)}°C`;
      weatherTemp.textContent = Math.round(data.main.temp);
      weatherLocation.textContent = data.name;
    })
    .catch(err => console.error("Weather fetch error:", err));
}

// Try to get geolocation, fallback to Kolkata if denied/unavailable
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => fetchWeather(position.coords.latitude, position.coords.longitude),
    (error) => fetchWeather(22.5726, 88.3639) // Kolkata fallback
  );
} else {
  fetchWeather(22.5726, 88.3639);
}

// Dynamic Mouse Tracking for Jarvis Panels
document.querySelectorAll('.panel').forEach(panel => {
  panel.addEventListener('mousemove', (e) => {
    const rect = panel.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    panel.style.setProperty('--mouse-x', `${x}px`);
    panel.style.setProperty('--mouse-y', `${y}px`);
  });
});
