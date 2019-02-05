'use strict'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './components/app.jsx'

import WeatherAPI from './lib/weather-api'

if (document.readyState === 'loading') {
  window.addEventListener('load', onLoad)
} else {
  onLoad()
}

async function onLoad () {
  ReactDOM.render(
    <App />,
    document.getElementById('app-wrapper')
  )

  const locationInfo = await WeatherAPI.fetchLocationInfo(35.7054, -78.7963)
  console.log(locationInfo)
}
