'use strict'

import uuidV4 from 'uuid/v4'

import fetchJSON from './fetch-json'
import { getUnit } from './units'

class WeatherAPI {
  // fetch location info
  async fetchLocationInfo (lat, lng) {
    const url = `https://api.weather.gov/points/${lat},${lng}`

    try {
      var result = await fetchJSON(url)
    } catch (err) {
      return null
    }

    if (result == null) return null

    const properties = result.properties
    if (properties == null) return null

    const { cwa, gridX, gridY, timeZone } = properties
    const office = cwa

    if (cwa == null || gridX == null || gridY == null) return null

    const name = this._getName(properties)

    try {
      var elevation = await this._getElevation(office, gridX, gridY)
    } catch (err) {
      return null
    }

    if (elevation == null) return null

    const id = uuidV4()
    return { id, name, lat, lng, elevation, office, gridX, gridY, timeZone }
  }

  // fetch weather summary
  async fetchWeatherSummary (locationInfo) {
    const { office, gridX, gridY } = locationInfo
    const url = `https://api.weather.gov/gridpoints/${office}/${gridX},${gridY}/forecast`

    try {
      var result = await fetchJSON(url)
    } catch (err) {
      return null
    }

    if (result == null) return null

    const properties = result.properties
    if (properties == null) return null

    const updatedAt = properties.updated
    const fetchedAt = new Date().toISOString()
    const periods = properties.periods

    if (!Array.isArray(periods)) return null

    return { updatedAt, fetchedAt, periods }
  }

  // fetch weather forecast
  async fetchWeatherForecast (locationInfo) {
  }

  // get the location name from the properties
  _getName (properties) {
    const unknown = 'Uknownville, US'

    const relativeLocation = properties.relativeLocation
    if (relativeLocation == null) return unknown

    const props = relativeLocation.properties
    if (props == null) return unknown

    const { city = 'Uknownville', state = 'US' } = props

    return `${city}, ${state}`
  }

  async _getElevation (office, gridX, gridY) {
    const url = `https://api.weather.gov/gridpoints/${office}/${gridX},${gridY}/forecast`

    try {
      var result = await fetchJSON(url)
    } catch (err) {
      return null
    }

    if (result == null) return null

    const properties = result.properties
    if (properties == null) return null

    const elevation = properties.elevation
    if (properties == null) return null

    const { value, unitCode } = elevation
    if (value == null) return null
    if (unitCode == null) return null

    const unit = getUnit(unitCode)
    if (unit == null) return null

    const feet = unit.convertTo('ft', value)
    if (feet == null) return null

    return feet
  }
}

export default new WeatherAPI()
