'use strict'

import React, { useState } from 'react'

import LocationDisplay from '../location-display.jsx'
import Scrollable from '../scrollable.jsx'

import useDomEvent from '../hooks/use-dom-event'
import useNodeEvent from '../hooks/use-node-event'

import Store from '../../lib/store'
import setImmediate from '../../lib/set-immediate'

export default function WeatherSummaryPage (props) {
  const [ location, setLocation ] = useState(Store.getCurrentLocation())
  const [ summary, setSummary ] = useState(null)

  useNodeEvent(Store, 'current-location-changed', (location) => {
    setLocation(location)
    updateWeather(location)
  })

  useNodeEvent(Store, 'weather-summary-changed', (changedLocation, changedSummary) => {
    if (changedLocation !== location) return

    setSummary(changedSummary)
  })

  useDomEvent(window, 'keydown', (event) => {
    if (event.key === 'ArrowLeft') Store.decrCurrentLocation()
    if (event.key === 'ArrowRight') Store.incrCurrentLocation()
  })

  if (summary == null) {
    // async request to get summary
    setImmediate(updateWeather, location)

    return (
      <Scrollable>
        <LocationDisplay location={location} />
        <p>fetching weather summary ...</p>
      </Scrollable>
    )
  }

  return (
    <React.Fragment>
      <Scrollable onClick={onClick}>
        <LocationDisplay location={location} updatedAt={summary.updatedAt} />
        {summary.periods.map(period =>
          <div key={period.number}>
            <h4 className='weather-summary-period-title'>{period.name}</h4>
            <p className='weather-summary-period-text'>{period.detailedForecast}</p>
          </div>
        )}
      </Scrollable>
    </React.Fragment>
  )

  async function updateWeather (location) {
    const summary = await Store.getWeatherSummary(location)
    if (summary == null) return

    setSummary(summary)
  }

  function onClick (event) {
    const contentElement = document.getElementById('content')

    if (event.clientX < contentElement.clientWidth / 2) {
      Store.decrCurrentLocation()
    } else {
      Store.incrCurrentLocation()
    }
  }
}
