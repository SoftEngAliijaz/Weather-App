// DOM Elements
const cityInput = document.getElementById("cityInput");
const locationElement = document.getElementById("location");
const temperatureElement = document.getElementById("temperature");
const windElement = document.getElementById("wind");
const humidityElement = document.getElementById("humidity");
const weatherConditionElement = document.getElementById("weather-condition");
const forecastContainer = document.getElementById("forecast-cards");

const API_KEY = "68526a92a8913622ab2b882cedd25cb8";

// Get weather by city name
async function getWeatherByCity(cityName) {
  const city = cityName || cityInput.value.trim();
  if (!city) {
    alert("Please enter a city name");
    return;
  }

  try {
    // Get current weather
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    const currentResponse = await fetch(currentWeatherUrl);
    const currentData = await currentResponse.json();

    if (currentData.cod !== 200) {
      throw new Error(currentData.message);
    }

    updateCurrentWeather(currentData);

    // Get forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    updateForecast(forecastData);
  } catch (error) {
    alert(`Error: ${error.message}`);
    console.error(error);
  }
}

// Update current weather display
function updateCurrentWeather(data) {
  const date = new Date(data.dt * 1000).toISOString().split("T")[0];
  locationElement.textContent = `${data.name} (${date})`;
  temperatureElement.textContent = `Temperature: ${data.main.temp.toFixed(
    1
  )}°C`;
  windElement.textContent = `Wind: ${data.wind.speed.toFixed(1)} M/S`;
  humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
  weatherConditionElement.textContent = data.weather[0].description;
}

// Update forecast display
function updateForecast(data) {
  // Clear previous forecast
  forecastContainer.innerHTML = "";

  const forecastsByDay = {};
  data.list.forEach((forecast) => {
    const date = new Date(forecast.dt * 1000).toISOString().split("T")[0];
    if (!forecastsByDay[date]) {
      forecastsByDay[date] = [];
    }
    forecastsByDay[date].push(forecast);
  });

  const today = new Date().toISOString().split("T")[0];
  let dayCount = 0;
  const dailyForecasts = [];

  for (const date in forecastsByDay) {
    if (date !== today && dayCount < 4) {
      const middayForecast =
        forecastsByDay[date].find((f) => {
          const hour = new Date(f.dt * 1000).getHours();
          return hour >= 11 && hour <= 13;
        }) || forecastsByDay[date][0];

      dailyForecasts.push(middayForecast);
      dayCount++;
    }
  }

  dailyForecasts.forEach((forecast) => {
    const formattedDate = new Date(forecast.dt * 1000).toLocaleDateString(
      "en-US",
      {
        weekday: "short",
        month: "short",
        day: "numeric",
      }
    );

    const card = document.createElement("div");
    card.className =
      "w-full min-h-[200px] md:min-h-[200px] border rounded-lg flex flex-col justify-evenly p-5 shadow-lg bg-white text-gray-700";
    card.innerHTML = `
      <p class="font-medium">${formattedDate}</p>
      <p>Temp: ${forecast.main.temp.toFixed(1)}°C</p>
      <p>Wind: ${forecast.wind.speed.toFixed(1)} M/S</p>
      <p>Humidity: ${forecast.main.humidity}%</p>
    `;

    forecastContainer.appendChild(card);
  });
}

window.onload = function () {
  getWeatherByCity("Sahiwal");
};
