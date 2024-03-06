'use strict';

const API_KEY = "c36508d37286c777e3389fe115f253ab";
const BASE_URL =`https://api.openweathermap.org/`

/**
 * Fetch data from server
 * @param {string}  URL API url
 * @param {Function} callback callback
 */
export const fetchData = function (URL, callback) {
  fetch(`${BASE_URL}${URL}&appid=${API_KEY}`)
    .then(res => res.json())
    .then(data => callback(data));
}

export const url = {
  currentWeather(lat, lon) {
    return `data/2.5/weather?${lat}&${lon}&units=metric&`;
  },

  forecast(lat, lon) {
    return `data/2.5/forecast?${lat}&${lon}&units=metric`;
  },
  // forecast(lat, lon) {
  //   return `data/3.0/onecall?${lat}&${lon}&units=metric&exclude=minutely,alerts`;
  // },

  airPollution(lat, lon) {
    return `data/2.5/air_pollution?${lat}&${lon}`;
  },

  reverseGeo(lat, lon) {
    return `geo/1.0/reverse?${lat}&${lon}&limit=5`;
  },

  /**
   * @param {string} query
   */
  geo(query) {
    return `geo/1.0/direct?q=${query}&limit=5`;
  },
};

