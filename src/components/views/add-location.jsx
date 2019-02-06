'use strict'
import React from 'react'
import Leaflet from '../../lib/leaflet'

import View from './view.jsx'
import WeatherAPI from '../../lib/weather-api'
import round from '../../lib/round'
import Store from '../../lib/store'

export default class AddLocationView extends View {
  render () {
    return <div id='map' />
  }

  componentDidMount () {
    const map = Leaflet.map('map').setView([39.828175, -98.5795], 4)

    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    for (let locationInfo of Store.getLocations()) {
      createExistingLocationMarker(map, locationInfo)
    }

    map.on('click', async mouseEvent => {
      const { lat, lng } = mouseEvent.latlng

      const marker = Leaflet.marker([lat, lng])
      marker
        .addTo(map)
        .bindPopup('looking up location ...')
        .openPopup()

      const popup = marker.getPopup()
      addPopupInfo(map, marker, popup, lat, lng)

      marker.addEventListener('popupclose', () => {
        marker.remove()
      })
    })
  }
}

AddLocationView.id = 'add-location-view'

function createExistingLocationMarker (map, locationInfo) {
  const marker = Leaflet.marker([locationInfo.lat, locationInfo.lng])

  const container = getLocationPopupContent(locationInfo)
  const button = Leaflet.DomUtil.create('button')
  container.appendChild(button)

  button.innerHTML = 'delete location'
  button.onclick = () => {
    Store.deleteLocation(locationInfo)
    marker.closePopup()
    marker.remove()
  }

  marker
    .addTo(map)
    .bindPopup(container)
}

// get the info for the popup
async function addPopupInfo (map, marker, popup, lat, lng) {
  lat = round(lat, 3)
  lng = round(lng, 3)
  const locationInfo = await WeatherAPI.fetchLocationInfo(lat, lng)

  if (locationInfo == null) {
    popup.setContent(`No weather info available for ${lat}, ${lng}`)
    popup.update()
    return
  }

  const container = getLocationPopupContent(locationInfo)
  const button = Leaflet.DomUtil.create('button')
  container.appendChild(button)

  button.innerHTML = 'add location'
  button.onclick = () => {
    Store.addLocation(locationInfo)
    marker.closePopup()
    createExistingLocationMarker(map, locationInfo)
  }

  popup.setContent(container)
  popup.update()
}

function getLocationPopupContent (locationInfo) {
  const container = Leaflet.DomUtil.create('div')

  container.innerHTML = `
    <b>${escapeHtml(locationInfo.name)}</b>
    <ul>
      <li>${escapeHtml(locationInfo.lat)}, ${escapeHtml(locationInfo.lng)}</li>
      <li>elevation: ${escapeHtml(locationInfo.elevation)} ft</li>
    </ul>
  `

  return container
}

function escapeHtml (string) {
  return `${string}`
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

window.usWeatherAddLocation = async function addLocation (lat, lng) {
  const locationInfo = await WeatherAPI.fetchLocationInfo(lat, lng)
  Store.addLocation(locationInfo)
}
