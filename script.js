const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API Key
const getWeatherBtn = document.getElementById('getWeatherBtn');
const getLocationWeatherBtn = document.getElementById('getLocationWeatherBtn');
const weatherDisplay = document.getElementById('weatherDisplay');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const humidityElement = document.getElementById('humidity');
const windElement = document.getElementById('wind');
const weatherIcon = document.getElementById('weatherIcon');
const loader = document.getElementById('loader');
const errorElement = document.getElementById('error');

// Function to show loader
function showLoader() {
    loader.classList.remove('hidden');
}

// Function to hide loader
function hideLoader() {
    loader.classList.add('hidden');
}

// Function to fetch weather data from API
function fetchWeather(city) {
    showLoader();
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            hideLoader();
            displayWeather(data);
        })
        .catch(error => {
            hideLoader();
            showError();
        });
}

// Function to display weather data
function displayWeather(data) {
    errorElement.classList.add('hidden');
    const { name, main, weather, wind } = data;
    locationElement.textContent = `Weather in ${name}`;
    temperatureElement.textContent = `Temperature: ${main.temp}°C`;
    descriptionElement.textContent = `Conditions: ${weather[0].description}`;
    humidityElement.textContent = `Humidity: ${main.humidity}%`;
    windElement.textContent = `Wind Speed: ${wind.speed} m/s`;

    // Set the weather icon
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    weatherIcon.src = iconUrl;

    weatherDisplay.classList.remove('hidden');
}

// Function to show error message
function showError() {
    weatherDisplay.classList.add('hidden');
    errorElement.classList.remove('hidden');
}

// Get weather data from city input
getWeatherBtn.addEventListener('click', () => {
    const city = document.getElementById('city').value;
    if (city) {
        fetchWeather(city);
    } else {
        alert('Please enter a city!');
    }
});

// Get weather data based on user's location
getLocationWeatherBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        showLoader();
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Unable to retrieve weather data');
                    }
                    return response.json();
                })
                .then(data => {
                    hideLoader();
                    displayWeather(data);
                })
                .catch(error => {
                    hideLoader();
                    showError();
                });
        });
    } else {
        alert('Geolocation is not supported by your browser!');
    }
});
