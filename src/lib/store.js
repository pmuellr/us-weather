'use strict'

import RemovableEventEmitter from './removable-event-emitter'
import WeatherSummaryView from '../components/views/weather-summary.jsx'
import WeatherAPI from './weather-api'
import DateCalc from './date-calc'

const LocalStorage = window.localStorage

class Store extends RemovableEventEmitter {
  constructor () {
    super()

    this._currentViewId = LocalStorage.getItem(KEY_CURRENT_VIEW_ID)
    this._currentLocationId = LocalStorage.getItem(KEY_CURRENT_LOCATION_ID)
    this._locations = jsonParse(LocalStorage.getItem(KEY_LOCATIONS))

    if (this._currentView == null) {
      this._currentView = WeatherSummaryView.id
    }

    if (!Array.isArray(this._locations)) {
      this._locations = []
    }

    if (this.getCurrentLocation() == null) {
      if (this._locations.length > 0) {
        this._currentLocationId = this._locations[0].id
      }
    }
  }

  getCurrentViewId () {
    return this._currentViewId
  }

  setCurrentViewId (viewId) {
    if (viewId.endsWith('-view')) {
      LocalStorage.setItem(KEY_CURRENT_VIEW_ID, viewId)
    }

    this.emit('current-view-changed', viewId)
  }

  incrCurrentLocation () {
    let location = this.getCurrentLocation()
    if (location == null) return null

    let index = this._locationIndex(location)

    index++
    if (index >= this._locations.length) index = 0

    this.setCurrentLocation(this._locations[index])
  }

  decrCurrentLocation () {
    let location = this.getCurrentLocation()
    if (location == null) return null

    let index = this._locationIndex(location)

    index--
    if (index < 0) index = this._locations.length - 1

    this.setCurrentLocation(this._locations[index])
  }

  getCurrentLocation () {
    let location = this._locationById(this._currentLocationId)
    if (location != null) return location
    if (this._locations.length === 0) return null

    return this._locations[0]
  }

  setCurrentLocation (location) {
    this._currentLocationId = location.id
    LocalStorage.setItem(KEY_CURRENT_LOCATION_ID, location.id)
    this.emit('current-location-changed', location)
  }

  getLocations () {
    return this._locations.slice()
  }

  setLocations (locations) {
    this._locations = locations
    LocalStorage.setItem(KEY_LOCATIONS, JSON.stringify(locations))

    // ensure current location is set
    if (this.getCurrentLocation() == null) {
      if (locations.length !== 0) {
        this.setCurrentLocation(locations[0])
      }
    }

    this.emit('locations-changed', locations)
  }

  addLocation (locationInfo) {
    this._locations.push(locationInfo)
    this.setLocations(this._locations)
    this.emit('location-added', locationInfo)
  }

  deleteLocation (locationInfo) {
    locationInfo = this._locationById(locationInfo.id)
    const index = this._locations.indexOf(locationInfo)
    if (index === -1) throw new Error(`location not in stored locations: ${locationInfo.name}`)

    LocalStorage.removeItem(`${KEY_WEATHER_SUMMARY}-${locationInfo.id}`)

    this._locations.splice(index, 1)
    this.setLocations(this._locations)
    this.emit('location-deleted', locationInfo)
  }

  async updateWeatherInfoIfNeeded () {
    for (let location of this.getLocations()) {
      this.getWeatherSummary(location)
    }
  }

  async getWeatherSummary (location) {
    const id = location.id
    let summary = jsonParse(LocalStorage.getItem(`${KEY_WEATHER_SUMMARY}-${id}`))

    if (summary != null) {
      if (DateCalc.hoursDifferenceFromNow(summary.fetchedAt) > 1) summary = null
    }

    if (summary != null) return summary

    summary = await WeatherAPI.fetchWeatherSummary(location)
    if (summary == null) return null

    LocalStorage.setItem(`${KEY_WEATHER_SUMMARY}-${id}`, JSON.stringify(summary))

    return summary
  }

  _locationById (id) {
    if (id == null) return null

    for (let location of this._locations) {
      if (location.id === id) return location
    }

    return null
  }

  _locationIndex (location) {
    if (location == null) return null

    const index = this._locations.indexOf(location)
    if (index === -1) return null

    return index
  }
}

const KEY_PREFIX = `us-weather`
const KEY_CURRENT_VIEW_ID = `${KEY_PREFIX}-current-view-id`
const KEY_CURRENT_LOCATION_ID = `${KEY_PREFIX}-current-location-id`
const KEY_LOCATIONS = `${KEY_PREFIX}-locations`
const KEY_WEATHER_SUMMARY = `${KEY_PREFIX}-weather-summary`

export default new Store()

function jsonParse (string) {
  try {
    return JSON.parse(string)
  } catch (err) {
    return undefined
  }
}
