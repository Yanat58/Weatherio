// 'use strict';

import { fetchData, url } from './api.js';
import * as module from './module.js';

/**
 * add event listener on multiple elements
 * @param {NodeList} elements
 * @param {string} eventType
 * @param {Function} callback
 */
const addEventOnElements = function (elements, eventType, callback) {
  for (let element of elements) {
    element.addEventListener(eventType, callback);
  }
};

//toggle search in mobile

const searchView = document.getElementById('data-search-view');

const searchTogglers = document.querySelectorAll('[data-search-toggler]');

const toggleSearch = () => searchView.classList.toggle('active');
addEventOnElements(searchTogglers, 'click', toggleSearch);

//search integration

const searchClose = document.querySelector('[data-search-close');
const searchField = document.getElementById('data-search-field');
const searchResult = document.querySelector('[data-search-result]');

let searchTimeout = null;
const searchTimeoutDuration = 500;

searchField.addEventListener('input', function () {
  searchTimeout ?? clearTimeout(searchTimeout);

  if (!searchField.value) {
    searchResult.classList.remove('active');
    searchResult.innerHTML = '';
    searchField.classList.remove('searching');
  } else {
    searchField.classList.add('searching');
  }

  if (searchField.value) {
    searchTimeout = setTimeout(() => {
      fetchData(url.geo(searchField.value), function (locations) {
        searchField.classList.remove('searching');
        searchClose.classList.add('active');
        searchResult.classList.add('active');
        searchResult.innerHTML = `
         <ul class="view-list" data-search-list></ul>
        `;

        const /**{NodeList} | [] */ items = [];

        for (const { name, lat, lon, country, state } of locations) {
          const searchItem = document.createElement('li');
          searchItem.classList.add('view-item');

          searchItem.innerHTML = `
            <span class="m-icon">location_on</span>

            <div >
              <p class="item-title">${name}</p>

              <p class="label-2 item-subtitle">${state || ''} ${country} </p>
            </div>

            <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link has-state"
            aria-label="${name} weather" data-search-toggler></a>
          `;

          searchResult.querySelector('[data-search-list]').append(searchItem);
          items.push(searchItem.querySelector('[data-search-toggler]'));
        }

        addEventOnElements(items, 'click', function () {
          toggleSearch();
          searchResult.classList.remove('active');
        });

        searchClose.addEventListener('click', function () {
          searchField.value = '';
          searchResult.innerHTML = '';
          searchClose.classList.remove('active');
        });
      });
    }, searchTimeoutDuration);
  }
});

const container = document.querySelector('[data-container');
const loading = document.querySelector('[data-loading]');
const currentLocationBtn = document.querySelector('[data-current-location-btn]');
const errorContent = document.querySelector('[data-error-content]');

/**
 *
 * @param {number} lat
 * @param {number} lon
 */
export const updateWeather = function (lat, lon) {
  errorContent.style.display = 'none';

  const currentWeatherSection = document.querySelector('[data-current-weather]');
  const highlightSection = document.querySelector('[data-highlights]');
  const hourlySection = document.querySelector('[data-hourly-forecast]');
  const forecastSection = document.querySelector('[data-5-day-forecast]');

  currentWeatherSection.innerHTML = '';
  highlightSection.innerHTML = '';
  hourlySection.innerHTML = '';
  forecastSection.innerHTML = '';

  if (window.location.hash === '#/current-location') {
    currentLocationBtn.setAttribute('disabled', '');
  } else {
    currentLocationBtn.removeAttribute('disabled');
  }

  // Current  weather section
  fetchData(url.currentWeather(lat, lon), function (currentWeather) {
    const {
      weather,
      dt: dateUnix,
      sys: { sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC },
      main: { temp, feels_like, pressure, humidity },
      visibility,
      timezone,
    } = currentWeather;

    const [{ description, icon, main }] = weather;

    const card = document.createElement('div');
    card.classList.add('card', 'card-lg', 'current-weather-card');

    card.innerHTML = `
      <h2 class="title-2 card-title">Now</h2>

      <ul class="meta-list">

        <li class="meta-item">
          <span class="m-icon">location_on</span>
          <p class="title-3 " data-location></p>
        </li>

        <li class="meta-item">
          <span class="m-icon">calendar_today</span>
          <p class="title-3 ">${module.getDate(dateUnix, timezone)}</p>
        </li>
      </ul>
      <div class="wrapper">
        <p class="heading">${parseInt(temp)}&deg;C</p>

        <img
          src="https://openweathermap.org/img/wn/${icon}.png"
          alt=${description}
          class="weather-icon"
          width="110"
          height="110"
        />
      </div>
      <p class="body-3 ">${description}</p> 
    `;

    fetchData(url.reverseGeo(lat, lon), function ([{ name, country }]) {
      card.querySelector('[data-location]').innerHTML = `${name}, ${country}`;
    });

    currentWeatherSection.append(card);

    switch (main) {
      case 'Snow':
        card.style.backgroundImage = "url('./assest/image/weather-animations/snow.gif')";
        card.style.backgroundRepeat = 'no-repeat';
        card.style.backgroundSize = 'cover';
        break;

      case 'Atmosphere':
        card.style.backgroundImage = "url('./assest/image/weather-animations/fog.gif')";
        card.style.backgroundRepeat = 'no-repeat';
        card.style.backgroundSize = 'cover';
        break;

      case 'Clouds':
        card.style.backgroundImage = "url('./assest/image/weather-animations/clouds.gif')";
        card.style.backgroundRepeat = 'no-repeat';
        card.style.backgroundSize = 'cover';
        break;

      case 'Clear':
        card.style.backgroundImage = "url('./assest/image/weather-animations/clear.gif')";
        card.style.backgroundRepeat = 'no-repeat';
        card.style.backgroundSize = 'cover';
        break;

      case 'Rain':
        card.style.backgroundImage = "url('./assest/image/weather-animations/rain.gif')";
        card.style.backgroundRepeat = 'no-repeat';
        card.style.backgroundSize = 'cover';
        break;

      case 'Drizzle':
        card.style.backgroundImage = "url('./assest/image/weather-animations/rain.gif')";
        card.style.backgroundRepeat = 'no-repeat';
        card.style.backgroundSize = 'cover';
        break;

      case 'Thunderstorm':
        card.style.backgroundImage = "url('./assest/image/weather-animations/thunderstorm.gif')";
        card.style.backgroundRepeat = 'no-repeat';
        card.style.backgroundSize = 'cover';
        break;

      default:
        card.style.backgroundImage = "url('./assest/image/weather-animations/clear.gif')";
        card.style.backgroundRepeat = 'no-repeat';
        card.style.backgroundSize = 'cover';
    }

    // Todays highlights

    fetchData(url.airPollution(lat, lon), function (airPollution) {
      const [
        {
          main: { aqi },
          components: { no2, o3, so2, pm2_5 },
        },
      ] = airPollution.list;

      const card = document.createElement('div');
      card.classList.add('card', 'card-lg');

      card.innerHTML = `
       <h2 id="highlights-label" class="title-2">Todays Highlights</h2>

      <div class="highlights-list">
        <div class="card card-sm highlights-card one">
          <h3 class="title-3">Air Quality Index</h3>

          <div class="wrapper">
            <span class="m-icon">air</span>

            <ul class="card-list">
              <li class="card-item">
                <p class="title-1">${pm2_5.toPrecision(3)}</p>
                <p class="label-1">PM<sub>2.5</sub></p>
              </li>

              <li class="card-item">
                <p class="title-1">${so2.toPrecision(3)}</p>
                <p class="label-1">SO<sub>2</sub></p>
              </li>

              <li class="card-item">
                <p class="title-1">${no2.toPrecision(3)}</p>
                <p class="label-1">NO<sub>2</sub></p>
              </li>

              <li class="card-item">
                <p class="title-1">${o3.toPrecision(3)}</p>
                <p class="label-1">O<sub>3</sub></p>
              </li>
            </ul>
          </div>

          <span class="badge aqi-${aqi} label-${aqi}" title=${module.aqiText[aqi].message}">${
        module.aqiText[aqi].level
      }</span>
        </div>

        <div class="card card-sm highlights-card two">
          <h3 class="title-3">Sunrise & Sunset</h3>

          <div class="card-list">
            <div class="card-item">
              <span class="m-icon">clear_day</span>

              <div>
                <p class="label-1">Sunrise</p>

                <p class="title-1">${module.getTime(sunriseUnixUTC, timezone)}</p>
              </div>
            </div>

            <div class="card-item">
              <span class="m-icon">clear_night</span>

              <div>
                <p class="label-1">Sunset</p>

                <p class="title-1">${module.getTime(sunsetUnixUTC, timezone)}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card card-sm highlights-card">
          <h3 class="title-3">Humidity</h3>

          <div class="wrapper">
            <span class="m-icon">humidity_percentage</span>

            <p class="title-1">${humidity}h<sub>%</sub></p>
          </div>
        </div>

        <div class="card card-sm highlights-card">
          <h3 class="title-3">Pressure</h3>

          <div class="wrapper">
            <span class="m-icon">airwave</span>
            <p class="title-1">${pressure}p<sub>hPa</sub></p>
          </div>
        </div>

        <div class="card card-sm highlights-card">
          <h3 class="title-3">Visibility</h3>

          <div class="wrapper">
            <span class="m-icon">visibility</span>

            <p class="title-1">${visibility / 1000}<sub>km</sub></p>
          </div>
        </div>

        <div class="card card-sm highlights-card">
          <h3 class="title-3">Feels like</h3>

          <div class="wrapper">
            <span class="m-icon">thermostat</span>

            <p class="title-1">${parseInt(feels_like)}&deg;<sub>C</sub></p>
          </div>
        </div>
      </div>
      `;

      highlightSection.append(card);
    });

    // 24h forecast sectioin

    fetchData(url.forecast(lat, lon), function (forecast) {
      const {
        list: forecastList,
        city: { timezone },
      } = forecast;

      hourlySection.innerHTML = `
       <h2 class="title-2">Today at</h2>

            <div class="slider-container">
              <ul class="slider-list" data-temp-wind>
               </ul>              
            </div>
      `;

      for (const [index, data] of forecastList.entries()) {
        if (index > 7) break;
        const {
          dt: dateTimeUnix,
          main: { temp },
          weather,
          wind: { deg: windDirection, speed: windSpeed },
        } = data;

        const [{ icon, description }] = weather;

        const tempLi = document.createElement('li');
        tempLi.classList.add('slider-item');
        tempLi.innerHTML = `
         <div class="card card-sm slider-card">
          <p class="body-3">${module.getHours(dateTimeUnix, timezone)}</p>

          <img
            src="https://openweathermap.org/img/wn/${icon}@2x.png"
            alt="${description}"
            width="48"
            height="48"
            loading="lazy"
            title="${description}"
            class="weather-icon"
          />

          <p class="body-3">${parseInt(temp)}&deg;</p>

            <img
              src="./assest/image/weather_icons/direction.png"
              alt="direction"
              width="48"
              height="48"
              loading="lazy"
              class="weather-icon"
              style="transform: rotate(${windDirection - 180}deg)"
            />

          <p class="body-3">${parseInt(module.mps_to_kmh(windSpeed))} km/h</p>

                   
        `;

        hourlySection.querySelector('[data-temp-wind]').append(tempLi);

        // const windli = document.createElement("li");

        // windli.classList.add("slider-item");

        // windli.innerHTML = `
        //   <div class="card card-sm slider-card">
        //     <p class="body-3">${module.getHours(dateTimeUnix, timezone)}</p>

        //     <img
        //       src="./assest/image/weather_icons/direction.png"
        //       alt="direction"
        //       width="48"
        //       height="48"
        //       loading="lazy"
        //       class="weather-icon"
        //       style="transform: rotate(${windDirection - 180}deg)"
        //     />

        //     <p class="body-3">${parseInt(module.mps_to_kmh(windSpeed))} km/h</p>
        //   </div>
        // `;

        // hourlySection.querySelector('[data-wind]').append(windli);
      }

      //  5 day forecast section

      forecastSection.innerHTML = `
      
            <h2 id="forecast-label" class="title-2">5 Days Forecast</h2>

            <div class="card card-lg forecast-card">
              <ul data-forecast-list ></ul>
            </div>
          
      `;

      for (let i = 7, len = forecastList.length; i < len; i += 8) {
        const {
          main: { temp_max },
          weather,
          dt_txt,
        } = forecastList[i];

        const [{ icon, description }] = weather;
        const date = new Date(dt_txt);

        const li = document.createElement('li');
        li.classList.add('card-item');

        li.innerHTML = `
          <div class="icon-wrapper">
            <img
              src="https://openweathermap.org/img/wn/${icon}.png"
              alt="${description}"
              class="weather-icon"
              width="58"
              height="58"
              title="${description}"
            />

            <span class="span">
              <p class="title-2">${parseInt(temp_max)}&deg;</p>
            </span>
          </div>

          <p class="label-1">${date.getDate()} ${module.monthNames[date.getUTCMonth()]}</p>
          <p class="label-1">${module.weekDayNames[date.getUTCDay()]}</p>
        `;

        forecastSection.querySelector('[data-forecast-list]').append(li);
      }

      loading.style.display = 'none';
      container.style.overflowY = 'overlay';
      container.classList.add('fade-in');
    });
  });
};

export const error404 = () => (errorContent.style.display = 'flex');
