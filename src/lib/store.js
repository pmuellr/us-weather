'use strict'

import RemovableEventEmitter from './removable-event-emitter'
import WeatherAPI from './weather-api'
import DateCalc from './date-calc'

const STALE_WEATHER_HOURS = 1
const LocalStorage = window.localStorage

class Store extends RemovableEventEmitter {
  constructor () {
    super()

    this._currentPageId = LocalStorage.getItem(KEY_CURRENT_PAGE_ID)
    this._currentLocationId = LocalStorage.getItem(KEY_CURRENT_LOCATION_ID)
    this._locations = jsonParse(LocalStorage.getItem(KEY_LOCATIONS))

    if (this._currentPageId == null) {
      this._currentPageId = 'weather-summary'
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

  getCurrentPageId () {
    return this._currentPageId
  }

  setCurrentPageId (pageId) {
    this._currentPageId = pageId
    LocalStorage.setItem(KEY_CURRENT_PAGE_ID, pageId)

    this.emit('current-page-changed', pageId)
  }

  incrCurrentLocation () {
    const location = this.getCurrentLocation()
    if (location == null) return null

    let index = this._locationIndex(location)

    index++
    if (index >= this._locations.length) index = 0

    this.setCurrentLocation(this._locations[index])
  }

  decrCurrentLocation () {
    const location = this.getCurrentLocation()
    if (location == null) return null

    let index = this._locationIndex(location)

    index--
    if (index < 0) index = this._locations.length - 1

    this.setCurrentLocation(this._locations[index])
  }

  getCurrentLocation () {
    const location = this._locationById(this._currentLocationId)
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
    for (const location of this.getLocations()) {
      this.getWeatherSummary(location)
    }
  }

  getWeatherSummary (location) {
    const id = location.id
    const summary = jsonParse(LocalStorage.getItem(`${KEY_WEATHER_SUMMARY}-${id}`))

    if (summary == null) {
      this.updateWeatherSummary(location)
    } else if (DateCalc.hoursDifferenceFromNow(summary.fetchedAt) > STALE_WEATHER_HOURS) {
      this.updateWeatherSummary(location)
    }

    return summary
  }

  async updateWeatherSummary (location) {
    const id = location.id
    const summary = await WeatherAPI.fetchWeatherSummary(location)
    if (summary == null) return

    LocalStorage.setItem(`${KEY_WEATHER_SUMMARY}-${id}`, JSON.stringify(summary))

    this.emit('weather-summary-changed', location, summary)
  }

  _locationById (id) {
    if (id == null) return null

    for (const location of this._locations) {
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

const KEY_PREFIX = 'us-weather'
const KEY_CURRENT_PAGE_ID = `${KEY_PREFIX}-current-page-id`
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
