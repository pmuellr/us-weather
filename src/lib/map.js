'use strict'

/* global L, fetch */

// open the map when the page loads
export function openMap () {
  const map = L.map('map').setView([35.70539, -78.7963], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  map.on('click', async mouseEvent => {
    const { lat, lng } = mouseEvent.latlng

    L.marker([lat, lng]).addTo(map)
      .bindPopup(await getPopupInfo(lat, lng))
      .openPopup()
  })
}

// get the info for the popup
async function getPopupInfo (lat, lon) {
  const [ locationInfo, forecastSummary ] = await Promise.all([
    getLocationInfo(lat, lon),
    getForecastSummary(lat, lon)
  ])

  if (locationInfo == null || forecastSummary == null) {
    return `
      <p>No weather info available for ${lat}, ${lon}</p>
    `
  }

  return `
    <p>${locationInfo.location}, ele ${locationInfo.elevationFt}, tz: ${locationInfo.timeZone}</p>
    <p>${forecastSummary.periods[0].detailedForecast}</p>
  `
}

// get the location info
async function getLocationInfo (lat, lon) {
  return getJSON(`/api/v1/location/info?location=${lat},${lon}`)
}

// get the forecast summary
async function getForecastSummary (lat, lon) {
  return getJSON(`/api/v1/forecast/summary?location=${lat},${lon}`)
}

// get the json from a url
async function getJSON (url) {
  try {
    var response = await fetch(url)
  } catch (err) {
    return { error: `error fetching ${url}: ${err.message}` }
  }

  if (response.status >= 400 && response.status < 500) {
    return null
  }

  try {
    var result = await response.json()
  } catch (err) {
    return { error: `error parsing json from ${url}: ${err.message}` }
  }

  return result
}

// build chart on window load
// if (document.readyState === 'loading') {
//   window.addEventListener('load', openMap)
// } else {
//   openMap()
// }
