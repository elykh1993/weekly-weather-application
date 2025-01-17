// script.js
const apiKey = '32c147262a30dc4b10b7fcddb7142439'; // Replace with your OpenWeatherMap API key
const getWeatherBtn = document.getElementById('getWeatherBtn');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');
const weeklyForecast = document.getElementById('weeklyForecast');
const randomForecast = document.getElementById('randomForecast'); // New element for random forecast

// Fetch weather data for Tehran on page load
window.onload = () => {
    fetchWeatherData('Tehran');
};

// Event listener for the button click
getWeatherBtn.addEventListener('click', () => {
    const city = cityInput.value.trim(); // Trim whitespace
    if (city) {
        fetchWeatherData(city);
    } else {
        weatherResult.innerHTML = `<p>Please enter a city name!</p>`;
        weeklyForecast.innerHTML = ''; // Clear previous weekly forecast
        randomForecast.innerHTML = ''; // Clear previous random forecast
    }
});

// Function to fetch weather data
async function fetchWeatherData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        if (data.cod === 200) {
            displayWeather(data);
            fetchWeeklyForecast(data.coord.lat, data.coord.lon); // Fetch weekly forecast using coordinates
        } else {
            weatherResult.innerHTML = `<p>City not found!</p>`;
            weeklyForecast.innerHTML = ''; // Clear previous weekly forecast
            randomForecast.innerHTML = ''; // Clear previous random forecast
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        weatherResult.innerHTML = `<p>Error fetching weather data. Please try again later.</p>`;
        weeklyForecast.innerHTML = ''; // Clear previous weekly forecast
        randomForecast.innerHTML = ''; // Clear previous random forecast
    }
}

// Function to fetch weekly weather forecast
async function fetchWeeklyForecast(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}&units=metric`);
        const data = await response.json();

        if (data.daily) {
            displayWeeklyForecast(data.daily);
            displayRandomForecast(data.daily); // Display random forecast
        } else {
            weeklyForecast.innerHTML = `<p>Weekly forecast not available!</p>`;
            randomForecast.innerHTML = ''; // Clear previous random forecast
        }
    } catch (error) {
        console.error('Error fetching weekly forecast:', error);
        weeklyForecast.innerHTML = `<p>Error fetching weekly forecast. Please try again later.</p>`;
        randomForecast.innerHTML = ''; // Clear previous random forecast
    }
}

// Function to display weather data
function displayWeather(data) {
    const { name, main, weather, wind } = data;
    const emoji = getWeatherEmoji(weather[0].main); // Get the emoji based on weather condition
    const weatherHtml = `
        <h2>Weather in ${name} ${emoji}</h2>
        <p>Temperature: ${main.temp} °C</p>
        <p>Weather: ${weather[0].description}</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Wind Speed: ${wind.speed} m/s</p>
    `;
    weatherResult.innerHTML = weatherHtml;
}

// Function to display weekly forecast
function displayWeeklyForecast(daily) {
    const forecastHtml = daily.slice(1, 8).map(day => { // Skip today and get the next 7 days
        const date = new Date(day.dt * 1000).toLocaleDateString();
        const temp = day.temp.day;
        const description = day.weather[0].description;
        const emoji = getWeatherEmoji(day.weather[0].main);

        return `<div>
            <strong>${date} ${emoji}</strong>: ${temp} °C, ${description}
        </div>`;
    }).join('');

    weeklyForecast.innerHTML = `<h2>Weekly Forecast</h2>${forecastHtml}`;
}

// Function to display a random day's forecast
function displayRandomForecast(daily) {
    const randomIndex = Math.floor(Math.random() * (daily.length - 1)) + 1; // Random index for the next 7 days
    const day = daily[randomIndex];
    const date = new Date(day.dt * 1000).toLocaleDateString();
    const temp = day.temp.day;
    const description = day.weather[0].description;
    const emoji = getWeatherEmoji(day.weather[0].main);

    randomForecast.innerHTML = `
        <h3>Random Day Forecast</h3>
        <strong>${date} ${emoji}</strong>: ${temp} °C, ${description}
    `;
}

// Function to get weather emoji based on weather condition
function getWeatherEmoji(weather) {
    switch (weather) {
        case 'Clear':
            return '☀️'; // Sunny
        case 'Clouds':
            return '☁️'; // Cloudy
        case 'Rain':
            return '🌧️'; // Rainy
        case 'Snow':
            return '❄️'; // Snowy
        case 'Thunderstorm':
            return '⛈️'; // Thunderstorm
        default:
            return '🌈'; // Default emoji for unspecified weather
    }
}
