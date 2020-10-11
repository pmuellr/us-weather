'use strict'

import React, { useState } from 'react'
import { VegaLite } from 'react-vega'

import LocationDisplay from '../location-display.jsx'
import Scrollable from '../scrollable.jsx'

import useDomEvent from '../hooks/use-dom-event'
import useOnOffEvent from '../hooks/use-on-off-event'

import Store from '../../lib/store'

export default function WeatherSummaryPage (props) {
  const [location, setLocation] = useState(Store.getCurrentLocation())
  const [summary, setSummary] = useState(Store.getWeatherSummary(location))

  useOnOffEvent(Store, 'current-location-changed', (location) => {
    setLocation(location)
    setSummary(Store.getWeatherSummary(location))
  })

  useOnOffEvent(Store, 'weather-summary-changed', (changedLocation, changedSummary) => {
    if (changedLocation !== location) return

    setSummary(changedSummary)
  })

  useDomEvent(window, 'keydown', (event) => {
    if (event.key === 'ArrowLeft') Store.decrCurrentLocation()
    if (event.key === 'ArrowRight') Store.incrCurrentLocation()
  })

  if (summary == null) {
    return (
      <Scrollable>
        <LocationDisplay location={location} />
        <p>fetching weather summary ...</p>
      </Scrollable>
    )
  }

  const spec1 = getVegaLiteSpec({ mark: 'line', title: 'temperature', axis: 'degrees F' })
  const spec2 = getVegaLiteSpec({ mark: 'area', title: 'relative humidity', axis: 'percent' })
  const spec3 = getVegaLiteSpec({ mark: 'area', title: 'sky cover', axis: 'percent' })
  const spec4 = getVegaLiteSpec({ mark: 'line', title: 'wind speed', axis: 'mph' })
  const spec5 = getVegaLiteSpec({ mark: 'line', title: 'chance of precipitation', axis: 'percent' })
  const spec6 = getVegaLiteSpec({ mark: 'line', title: 'amount of precipitation', axis: 'inches' })

  const data1 = { table: summary.gridPoints.temperature }
  const data2 = { table: summary.gridPoints.relativeHumidity }
  const data3 = { table: summary.gridPoints.skyCover }
  const data4 = { table: summary.gridPoints.windSpeed }
  const data5 = { table: summary.gridPoints.probabilityOfPrecipitation }
  const data6 = { table: summary.gridPoints.quantitativePrecipitation }

  return (
    <div className='headerAndContentGrid'>
      <div className='headerCell'>
        <LocationDisplay location={location} updatedAt={summary.updatedAt} />
      </div>
      <div className='contentCell'>
        <Scrollable onClick={onClick}>
          {summary.periods.map(period =>
            <div key={period.number}>
              <h4 className='weather-summary-period-title'>{period.name}</h4>
              <p className='weather-summary-period-text'>{period.detailedForecast}</p>
            </div>
          )}
          <VegaLite spec={spec1} data={data1} actions={false} />
          <VegaLite spec={spec2} data={data2} actions={false} />
          <VegaLite spec={spec3} data={data3} actions={false} />
          <VegaLite spec={spec4} data={data4} actions={false} />
          <VegaLite spec={spec5} data={data5} actions={false} />
          <VegaLite spec={spec6} data={data6} actions={false} />
        </Scrollable>
      </div>
    </div>
  )

  function onClick (event) {
    const contentElement = document.getElementById('content')

    if (event.clientX < contentElement.clientWidth / 2) {
      Store.decrCurrentLocation()
    } else {
      Store.incrCurrentLocation()
    }
  }
}

function getVegaLiteSpec ({ mark, title, axis }) {
  return {
    title,
    width: 400,
    height: 200,
    mark: { type: mark, interpolate: 'bundle' },
    encoding: {
      x: { field: 'date', type: 'temporal' },
      y: { field: 'value', type: 'quantitative', title: axis }
    },
    data: { name: 'table' }
  }
}
