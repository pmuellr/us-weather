'use strict'

// converters between various units; unit codes from:
// http://codes.wmo.int/common/unit

import round from './round'

export { getUnit }

// return the Unit object for a given a unit code
function getUnit (unitCode = null) {
  if (unitCode != null) unitCode = unitCode.replace(/^unit:/, '')
  return Units.get(unitCode)
}

const Units = new Map()

// a self-descriptive unit object that can convert to other units
class Unit {
  constructor (code, name) {
    this._converters = new Map()
    this._code = code
    this._name = name
  }

  // accessors for code/name properties
  get code () { return this._code }
  get name () { return this._name }

  // convert a value from this to unit to another
  convertTo (toUnitCode, value) {
    if (toUnitCode === this.code) return value
    if (value == null) return null

    const converter = this._converters.get(toUnitCode)
    if (converter == null) {
      console.log(`no converter from ${this.code} to ${toUnitCode}`)
      return null
    }

    return converter(value)
  }

  // add a converter
  addConverterTo (toUnitCode, fn) {
    if (this._converters.has(toUnitCode)) {
      console.log(`unit ${this.code} already has converter to ${toUnitCode}`)
      return
    }
    return this._converters.set(toUnitCode, fn)
  }
}

// units from weather service
addUnit(null, 'null')
addUnit('null', 'null')
addUnit('degC', 'degrees Celsius')
addUnit('degree_(angle)', 'degrees')
addUnit('m', 'meters')
addUnit('m_s-1', 'meters per second')
addUnit('mm', 'millimetres')
addUnit('percent', 'percent')

// units to convert to
addUnit('f', 'degrees Fahrenheit')
addUnit('compass', 'compass point')
addUnit('ft', 'feet')
addUnit('mi', 'miles')
addUnit('mph', 'miles per hour')
addUnit('in', 'inches')

// add converters
addConverter(null, 'null', value => value)
addConverter('null', null, value => value)
addConverter('degC', 'f', value => round((value * 9 / 5) + 32))
addConverter('degree_(angle)', 'compass', degreesToCompass)
addConverter('m', 'ft', value => round(value * 3.28084, 1))
addConverter('m', 'mi', value => round(value / 1609.34), 1)
addConverter('m_s-1', 'mph', value => round(value * 2.23694))
addConverter('mm', 'in', value => round(value / 25.4, 2))

// adds a new unit
function addUnit (code, name) {
  if (Units.has(code)) {
    throw new Error(`unit already added: ${code}`)
  }

  Units.set(code, new Unit(code, name))
}

// adds a new converter
function addConverter (fromCode, toCode, fn) {
  if (!Units.has(fromCode)) {
    throw new Error(`unit not available: ${fromCode}`)
  }

  Units.get(fromCode).addConverterTo(toCode, fn)
}

// convert degrees (0 ... 360) to compass reading
function degreesToCompass (degrees) {
  degrees += 22.5

  if (degrees < 45) return 'N'
  if (degrees < 90) return 'NE'
  if (degrees < 135) return 'E'
  if (degrees < 180) return 'SE'
  if (degrees < 225) return 'S'
  if (degrees < 270) return 'SW'
  if (degrees < 315) return 'W'
  if (degrees < 360) return 'NW'
  return 'N'
}
