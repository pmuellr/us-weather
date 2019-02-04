'use strict'

import React from 'react'

import ToolBar from './tool-bar.jsx'

export default class App extends React.Component {
  render () {
    return <div id='app'>
      <h1 id='header'>
        U.S. weather
        <ToolBar />
      </h1>

      <div id='content'>
        <p>
          <a href='https://api.weather.gov/points/35.70539,-78.7963'>
            https://api.weather.gov/points/35.70539,-78.7963
          </a>
        </p>
        <p>
          <a href='https://forecast-v3.weather.gov/documentation'>
            https://forecast-v3.weather.gov/documentation
          </a>
        </p>
      </div>
    </div>
  }
}
