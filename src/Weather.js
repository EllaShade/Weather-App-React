import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ReactAnimatedWeather from "react-animated-weather";

import "./Weather.css";

export default function Weather() {
  const [city, setCity] = useState("Zurich");
  const [loaded, setLoaded] = useState(false);
  const [weather, setWeather] = useState({});
  const [displayedCity, setDisplayedCity] = useState(null);
  const [forecast, setForecast] = useState([]);
  const defaults = {
    color: "goldenrod",
    size: 64,
    animate: true,
  };

  const loadInitialWeather = useCallback(async (city) => {
    try {
      let apiKey = "05cd0a2o385623d1bd0t06fa44dfb1d2";
      let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
      const response = await axios.get(apiUrl);
      displayWeather(response);
      getForecast(response.data.city);
    } catch (error) {
      console.error("Initial weather load failed:", error);
    }
  }, []);

  useEffect(() => {
    loadInitialWeather(city);
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    let apiKey = "05cd0a2o385623d1bd0t06fa44dfb1d2";
    let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
    axios
      .get(apiUrl)
      .then((response) => {
        console.log("API Response:", response.data);
        displayWeather(response);
        getForecast(response.data.city);
      })
      .catch((error) => {
        console.error("API request failed:", error);
        loadInitialWeather(city);
      });
  }

  function displayWeather(response) {
    console.log("API Response:", response.data);

    if (
      response.data.temperature &&
      response.data.wind &&
      response.data.condition
    ) {
      setLoaded(true);
      const newWeather = {
        temperature: Math.round(response.data.temperature.current),
        wind: response.data.wind.speed,
        humidity: response.data.temperature.humidity,
        icon: response.data.condition.icon,
        description: response.data.condition.description,
        time: response.data.time,
      };

      setWeather(newWeather);
      setDisplayedCity(response.data.city);
      console.log("Weather state:", newWeather);
    } else {
      console.error("Invalid API response format", response.data);
    }
  }

  function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
  }

  function formatDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return days[date.getDay()];
  }

  function updateCity(event) {
    setCity(event.target.value);
  }

  function displayForecast(response) {
    console.log(response.data);

    if (response.data.daily) {
      let forecastData = response.data.daily.slice(0, 5);
      setForecast(forecastData);
    } else {
      console.error("Invalid forecast data format", response.data);
    }
  }

  function getForecast(city) {
    let apiKey = "05cd0a2o385623d1bd0t06fa44dfb1d2";
    let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
    axios(apiUrl).then((response) => {
      displayForecast(response);
    });
  }

  return (
    <div className="weather-app">
      <header>
        <form className="search-form" id="search-form" onSubmit={handleSubmit}>
          <input
            type="search"
            placeholder="Enter a city.."
            required
            id="search-form-input"
            className="search-form-input"
            onChange={updateCity}
          />
          <input type="submit" value="Search" className="search-form-button" />
        </form>
      </header>

      <main>
        <div className="weather-app-data">
          <div>
            <h1 className="weather-app-city" id="city">
              {displayedCity}
            </h1>
            <p className="weather-app-details">
              <span id="time">
                {formatTime(weather.time)}
                {""}
              </span>
              , <span id="description">{weather.description}</span>
              <br />
              Humidity: <strong id="humidity">{weather.humidity}%</strong>,
              Wind:
              <strong id="wind-speed">{weather.wind} km/h</strong>
            </p>
          </div>
          <div className="weather-app-temperature-container">
            <div className="weather-icon" id="icon">
              {weather.icon && (
                <ReactAnimatedWeather
                  icon={weather.icon.toUpperCase()}
                  color={defaults.color}
                  size={defaults.size}
                  animate={defaults.animate}
                />
              )}
            </div>
            <div className="weather-temperature" id="temperature">
              {weather.temperature}
            </div>
            <div className="weather-app-unit">°C</div>
          </div>
        </div>
        <div className="weather-app-forecast" id="forecast">
          {forecast.map((day, index) => (
            <div key={index} className="weather-app-forecast-day">
              <div className="weather-app-forecast-day-name">
                {formatDay(day.time)}
              </div>
              <div className="weather-app-forecast-day-icon">
                <img
                  src={day.condition.icon_url}
                  alt="Weather Icon"
                  className="weather-app-icon"
                />
              </div>
              <div className="weather-app-forecast-day-temperature">
                <strong>{Math.round(day.temperature.maximum)}°</strong> /{" "}
                {Math.round(day.temperature.minimum)}°
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer>
        <p>
          This project was coded by{" "}
          <a
            href="https://github.com/EllaShade"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ella Graf
          </a>{" "}
          and is on
          <a
            href="https://github.com/EllaShade/Weather-App-React"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            GitHub
          </a>{" "}
          and hosted on
          <a
            href="https://app.netlify.com/sites/weatherforecastapp-react/overview"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            Netlify
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
