'use strict'

import React from 'react'

import View from './view.jsx'
import LocationDisplay from '../location-display.jsx'
import Store from '../../lib/store'
import setImmediate from '../../lib/set-immediate'

export default class WeatherSummaryView extends View {
  constructor (props) {
    super(props)

    this.state = {
      location: Store.getCurrentLocation(),
      summary: null,
      error: null
    }

    this.removeListeners = []

    this.removeListeners.push(Store.removableOn('current-location-changed', location => {
      if (location === this.state.location) return

      this.setState({ location, summary: null })
    }))
  }

  componentDidMount () {
    const contentElement = document.getElementById('content')
    if (contentElement == null) return

    contentElement.addEventListener('click', handleClick)
    this.removeListeners.push(() => contentElement.removeEventListener('click', handleClick))

    window.addEventListener('keydown', handleKeyDown)
    this.removeListeners.push(() => window.removeEventListener('keydown', handleKeyDown))

    function handleClick (event) {
      if (event.clientX < contentElement.clientWidth / 2) {
        Store.decrCurrentLocation()
      } else {
        Store.incrCurrentLocation()
      }
    }

    function handleKeyDown (event) {
      if (event.key === 'ArrowLeft') Store.decrCurrentLocation()
      if (event.key === 'ArrowRight') Store.incrCurrentLocation()
    }
  }

  render () {
    const { location, summary, error } = this.state

    if (error != null) {
      return <div>
        <LocationDisplay location={location} />
        <p>error gettinging weather summary:</p>
        <p>{error.message}</p>
      </div>
    }

    if (summary == null) {
      setImmediate(getSummary, this, location)
      return <div>
        <LocationDisplay location={location} />
        <p>fetching weather summary ...</p>
      </div>
    }

    const extraDetails = `last updated at ${niceDate(summary.updatedAt)}`
    return <div>
      <LocationDisplay location={location} extraDetails={extraDetails} />
      {summary.periods.map(period =>
        <div key={period.number}>
          <h4 className='weather-summary-period-title'>{period.name}</h4>
          <p className='weather-summary-period-text'>{period.detailedForecast}</p>
        </div>
      )}
    </div>
  }

  componentWillUnmount () {
    for (let removeListener of this.removeListeners) {
      removeListener()
    }
  }
}

function niceDate (isoDate) {
  const date = new Date(isoDate)
  const month = Months[date.getMonth()]
  const day = date.getDate()
  const dow = Days[date.getDay()]
  const hour = `${date.getHours()}`.padStart(2, '0')
  const minute = `${date.getMinutes()}`.padStart(2, '0')

  return `${dow}, ${month} ${day} at ${hour}:${minute}`
}

const Months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ')
const Days = 'Sun Mon Tue Wed Thu Fri Sat'.split(' ')

async function getSummary (component, location) {
  try {
    var summary = await Store.getWeatherSummary(location)
  } catch (error) {
    component.setState({ error })
    return null
  }

  component.setState({ summary })
}

WeatherSummaryView.id = 'weather-summary-view'
