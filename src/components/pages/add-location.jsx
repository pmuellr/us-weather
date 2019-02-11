'use strict'
import React from 'react'
import Leaflet from '../../lib/leaflet'

import WeatherAPI from '../../lib/weather-api'
import round from '../../lib/round'
import Store from '../../lib/store'

export default class AddLocationView extends React.Component {
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
  let bounds = null

  if (locationInfo.bounds != null) {
    bounds = Leaflet.polygon(locationInfo.bounds, {
      color: '#0000F0',
      fillColor: '#F00000',
      opacity: 0.1,
      fillOpacity: 0.1
    })
    bounds.addTo(map)
  }

  const marker = Leaflet.marker([locationInfo.lat, locationInfo.lng])

  const container = getLocationPopupContent(locationInfo)
  const button = Leaflet.DomUtil.create('button')
  container.appendChild(button)

  button.innerHTML = 'delete location'
  button.setAttribute('style', 'background-color: #E0E0F0')
  button.onclick = () => {
    Store.deleteLocation(locationInfo)
    marker.closePopup()
    marker.remove()
    if (bounds != null) bounds.remove()
  }

  marker
    .addTo(map)
    .bindPopup(container)
}

// get the info for the popup
async function addPopupInfo (map, marker, popup, lat, lng) {
  lat = round(lat, 4)
  lng = round(lng, 4)
  const locationInfo = await WeatherAPI.fetchLocationInfo(lat, lng)

  if (locationInfo == null) {
    popup.setContent(`No weather info available for ${lat}, ${lng}`)
    popup.update()
    return
  }

  if (locationInfo.bounds != null) {
    const bounds = Leaflet.polygon(locationInfo.bounds, {
      color: '#0000F0',
      fillColor: '#F00000',
      opacity: 0.1,
      fillOpacity: 0.1
    })
    bounds.addTo(map)

    marker.addEventListener('popupclose', () => {
      bounds.remove()
    })
  }

  const container = getLocationPopupContent(locationInfo)
  const button = Leaflet.DomUtil.create('button')
  container.appendChild(button)

  button.innerHTML = 'add location'
  button.setAttribute('style', 'background-color: #E0E0F0')
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
    <div style='margin-left: 1em;'>
      ${escapeHtml(locationInfo.lat)},${escapeHtml(locationInfo.lng)}
      <br/>
      elevation: ${escapeHtml(locationInfo.elevation)} ft
    </div>
  `

  return container
}

function escapeHtml (string) {
  return `${string}`
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
