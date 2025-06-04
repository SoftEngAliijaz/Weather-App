const cityInput = document.getElementById("cityInput");
const locationElement = document.getElementById("location");
const tempElement = document.getElementById("temperature");
const windElement = document.getElementById("wind");
const humidityElement = document.getElementById("humidity");
const conditionElement = document.getElementById("weather-condition");
const iconElement = document.getElementById("weather-icon");
const forecastElement = document.getElementById("forecast-cards");

const API_KEY = "68526a92a8913622ab2b882cedd25cb8";

async function getWeather(city = cityInput.value.trim()) {
  if (!city) {
    alert("Please enter a city name");
    return;
  }

  locationElement.textContent = "Loading...";
  conditionElement.textContent = "";
  iconElement.classList.add("hidden");

  try {
    const currentWeatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );

    const currentData = await currentWeatherResponse.json();
    if (currentData.cod !== 200) {
      throw new Error(currentData.message);
    }

    const forecastData = await forecastResponse.json();

    showCurrent(currentData);
    showForecast(forecastData);
  } catch (error) {
    locationElement.textContent = "Error fetching data.";
    alert(error.message);
  }
}

function showCurrent(data) {
  const date = new Date(data.dt * 1000).toISOString().split("T")[0];
  locationElement.textContent = `${data.name} (${date})`;
  tempElement.textContent = `Temperature: ${data.main.temp.toFixed(1)}°C`;
  windElement.textContent = `Wind: ${data.wind.speed.toFixed(1)} M/S`;
  humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
  conditionElement.textContent = data.weather[0].description;

  iconElement.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  iconElement.alt = data.weather[0].description;
  iconElement.classList.remove("hidden");
}

function showForecast(data) {
  forecastElement.innerHTML = "";

  const today = new Date().toISOString().split("T")[0];
  const days = {};

  data.list.forEach((item) => {
    const day = new Date(item.dt * 1000).toISOString().split("T")[0];
    if (!days[day]) days[day] = [];
    days[day].push(item);
  });

  const daysToShow = Object.keys(days)
    .filter((day) => day !== today)
    .slice(0, 4);

  daysToShow.forEach((day) => {
    const forecast =
      days[day].find((f) => {
        const hour = new Date(f.dt * 1000).getHours();
        return hour >= 11 && hour <= 13;
      }) || days[day][0];

    const dateStr = new Date(forecast.dt * 1000).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    const card = document.createElement("div");
    card.className =
      "flex flex-col justify-evenly rounded-lg shadow-lg w-full border text-center forecast-card h-[200px] md:h-[180px]";
    card.innerHTML = `
        <p><strong>${dateStr}</strong></p>
        <p>Temp: ${forecast.main.temp.toFixed(1)}°C</p>
        <p>Wind: ${forecast.wind.speed.toFixed(1)} M/S</p>
        <p>Humidity: ${forecast.main.humidity}%</p>
      `;

    forecastElement.appendChild(card);
  });
}

window.onload = () => getWeather("Sahiwal");

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getWeather();
  }
});

function currentLocationAlert() {
  return alert("This feature is not implemented yet!");
}
