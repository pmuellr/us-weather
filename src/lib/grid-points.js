'use strict'

/** @typedef { import('./types').GridPointProperty } GridPointProperty */
/** @typedef { import('./types').WeatherValues } WeatherValues */
/** @typedef { import('./types').TimeDuration } TimeDuration */

/** @type { (gridPointData: unknown) => Record<string, WeatherValues[]> } */
export function gridPointsToWeatherData (gridPointData) {
  /** @type { Record<string, WeatherValues[]> } */
  const result = {}

  let type = 'temperature'
  let values = getDataFromProperties(gridPointData, type, c2f)
  result[type] = values

  type = 'relativeHumidity'
  values = getDataFromProperties(gridPointData, type)
  result[type] = values

  type = 'windChill'
  values = getDataFromProperties(gridPointData, type)
  result[type] = values

  type = 'skyCover'
  values = getDataFromProperties(gridPointData, type)
  result[type] = values

  type = 'windDirection'
  values = getDataFromProperties(gridPointData, type)
  result[type] = values

  type = 'windSpeed'
  values = getDataFromProperties(gridPointData, type, kph2mph)
  result[type] = values

  type = 'probabilityOfPrecipitation'
  values = getDataFromProperties(gridPointData, type)
  result[type] = values

  type = 'quantitativePrecipitation'
  values = getDataFromProperties(gridPointData, type, mm2in)
  result[type] = values

  type = 'iceAccumulation'
  values = getDataFromProperties(gridPointData, type, mm2in)
  result[type] = values

  type = 'snowfallAmount'
  values = getDataFromProperties(gridPointData, type, mm2in)
  result[type] = values

  type = 'pressure'
  values = getDataFromProperties(gridPointData, type)
  result[type] = values

  return result
}

function mapIdentity (value) {
  return value
}

/** @type { (gridPointData: unknown, name: string, mapFn: (any) => any) => WeatherValues[] } */
function getDataFromProperties (gridPointData, name, mapFn = mapIdentity) {
  if (!gridPointData) return []
  if (!gridPointData.properties) return []

  /** @type { GridPointProperty | undefined } */
  const property = gridPointData.properties[name]
  if (!property) return []

  /** @type { WeatherValues[] } */
  const result = []
  for (const propertyValue of property.values) {
    if (!propertyValue) continue

    const { validTime, value } = propertyValue
    if (value == null) continue

    const timeDuration = splitTimeDuration(validTime)
    if (!timeDuration) continue

    const { date, durationHours } = timeDuration

    for (let i = 0; i < durationHours; i++) {
      result.push({ date: datePlusHours(date, i), value: mapFn(value) })
    }
  }

  return result
}

/** @type { (gridPointData: unknown) => string } */
function getVersion (gridPointData) {
  if (!gridPointData) return 'unknown'

  /** @type { Array<Record<string, string> } */
  const context = gridPointData['@context'] || [{ '@version': '1.1' }]
  const versionObject = context.find((object) => object['@version'])
  if (!versionObject) return 'unknown'
  return versionObject['@version']
}

/** @type { (timeDuration: string) => TimeDuration | null } */
function splitTimeDuration (timeDuration) {
  // input: 2020-10-10T07:00:00+00:00/PT1H

  if (timeDuration == null) return null

  let parts = timeDuration.split('/')
  if (parts.length === 1) parts.push('PT1H')

  const [date, ptDuration] = parts

  const startDate = Date.parse(date)
  if (isNaN(startDate)) return null

  // PT1H or P3DT18H
  parts = ptDuration.match(/P((\d*)D)?(T(\d+)H)?/)
  const ptDays = parseInt(parts[2] || '0')
  const ptHours = parseInt(parts[4] || '0')

  return {
    date: startDate,
    durationHours: ptDays * 24 + ptHours
  }
}

/** @type { (date: Date, hours: number) => Date } */
function datePlusHours (date, hours) {
  return new Date(date.valueOf() + hours * 60 * 60 * 1000)
}

function c2f (c) {
  return Math.round((c * 9 / 5) + 32)
}

function kph2mph (kph) {
  return Math.round(kph / 1.609)
}

function mm2in (mm) {
  return Math.round(10 * mm / 25.4) / 10
}

// if invoked from cli, run a test
if (require.main === module) test()

function test () {
  const gridPointData = require('../../test/fixtures/weather-gridpoints.json')
  console.log('gridPoints data:')
  console.log('version: ', getVersion(gridPointData))

  const data = gridPointsToWeatherData(gridPointData)
  for (const key of data.keys()) {
    const datum = data.get(key)
    console.log(key, JSON.stringify(dumpValues(datum), null, 4))
  }
}

/** @type { (values: WeatherValues[]) => string[] } */
function dumpValues (values) {
  return values.map(value => `${value.date} ${JSON.stringify(value.value)}`)
}
