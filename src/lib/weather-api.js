'use strict'

/** @typedef { import('./types').WeatherValues } WeatherValues */

import { v4 as uuidV4 } from 'uuid'

import fetchJSON from './fetch-json'
import { getUnit } from './units'
import { gridPointsToWeatherData } from './grid-points'

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
    if (cwa == null || gridX == null || gridY == null) return null
    const office = cwa

    const name = this._getName(properties)

    try {
      var geoInfo = await this._getGeoInfo(office, gridX, gridY)
    } catch (err) {
      return null
    }

    if (geoInfo == null) return null

    const { elevation, bounds } = geoInfo

    if (elevation == null) return null

    const id = uuidV4()
    return { id, name, lat, lng, elevation, bounds, office, gridX, gridY, timeZone }
  }

  // fetch weather summary
  async fetchWeatherSummary (locationInfo) {
    const { office, gridX, gridY } = locationInfo

    let url = `https://api.weather.gov/gridpoints/${office}/${gridX},${gridY}/forecast`
    let result
    try {
      result = await fetchJSON(url)
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

    url = `https://api.weather.gov/gridpoints/${office}/${gridX},${gridY}`
    try {
      result = await fetchJSON(url)
    } catch (err) {
      return null
    }
    if (result == null) return null

    const gridPoints = gridPointsToWeatherData(result)

    return { updatedAt, fetchedAt, periods, gridPoints }
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

  async _getGeoInfo (office, gridX, gridY) {
    const url = `https://api.weather.gov/gridpoints/${office}/${gridX},${gridY}/forecast`

    try {
      var result = await fetchJSON(url)
    } catch (err) {
      return null
    }

    if (result == null) return null

    const elevation = getElevation(result)
    const bounds = getBounds(result)

    return { elevation, bounds }
  }
}

function getBounds (result) {
  if (result == null) return null

  const geometry = result.geometry
  if (geometry == null) return null

  const coordinates = geometry.coordinates
  if (coordinates == null) return null

  // first and past point the same, so remove the first
  const bounds = coordinates[0].slice(1)

  // the order is wrong for the lat lngs as well
  bounds.forEach(bound => {
    const lng = bound[0]
    const lat = bound[1]
    bound[0] = lat
    bound[1] = lng
  })

  return bounds
}

function getElevation (result) {
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

export default new WeatherAPI()
