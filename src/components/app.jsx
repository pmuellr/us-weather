'use strict'

import React, { useState } from 'react'

import ToolBar from './tool-bar.jsx'

import useNodeEvent from './hooks/use-node-event'

import NoLocationsPage from './pages/no-locations.jsx'
import HelpPage from './pages/help.jsx'
import WeatherSummaryPage from './pages/weather-summary.jsx'
import AddLocationPage from './pages/add-location.jsx'

import Store from '../lib/store'
import setImmediate from '../lib/set-immediate'

export default function App (props) {
  const [ locations, setLocations ] = useState(Store.getLocations())
  const [ currentPage, setCurrentPage ] = useState(Store.getCurrentPageId())

  useNodeEvent(Store, 'current-page-changed', (pageId) => {
    setCurrentPage(pageId)
  })

  useNodeEvent(Store, 'locations-changed', (locations) => {
    setLocations(locations)
  })

  setupWeatherUpdates()

  let contents
  if (currentPage === 'help') {
    contents = <HelpPage />
  } else if (currentPage === 'add-location') {
    contents = <AddLocationPage />
  } else if (locations.length === 0) {
    contents = <NoLocationsPage />
  } else if (currentPage === 'weather-summary') {
    contents = <WeatherSummaryPage />
  } else {
    contents = <HelpPage />
  }

  return (
    <div id='app'>
      <h1 id='header'>
        <span id='title'>U.S. weather</span>
        <ToolBar />
      </h1>

      <div id='content'>
        {contents}
      </div>
    </div>
  )
}

function setupWeatherUpdates () {
  setImmediate(update)
  setInterval(update, 1000 * 60 * 60)

  function update () {
    Store.updateWeatherInfoIfNeeded()
  }
}
