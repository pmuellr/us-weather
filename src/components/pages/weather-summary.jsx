'use strict'

import React, { useState } from 'react'

import LocationDisplay from '../location-display.jsx'
import Scrollable from '../scrollable.jsx'

import useDomEvent from '../hooks/use-dom-event'
import useOnOffEvent from '../hooks/use-on-off-event'

import Store from '../../lib/store'

export default function WeatherSummaryPage (props) {
  const [ location, setLocation ] = useState(Store.getCurrentLocation())
  const [ summary, setSummary ] = useState(Store.getWeatherSummary(location))

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
