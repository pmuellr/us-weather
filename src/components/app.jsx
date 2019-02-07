'use strict'

import React from 'react'

import ToolBar from './tool-bar.jsx'
import NoLocationsModal from './views/modals/no-locations.jsx'
import HelpModal from './views/modals/help.jsx'
import WeatherSummaryView from './views/weather-summary.jsx'
import AddLocationView from './views/add-location.jsx'
import EditLocationsView from './views/edit-locations.jsx'

import Store from '../lib/store'
import setImmediate from '../lib/set-immediate'

export default class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      locations: Store.getLocations(),
      currentViewId: Store.getCurrentViewId()
    }

    Store.on('current-view-changed', viewId => {
      if (viewId === this.state.currentViewId) return

      this.setState({ currentViewId: viewId })
    })

    Store.on('locations-changed', locations => {
      this.setState({ locations })
    })

    setupWeatherUpdates()
  }

  render () {
    let contentView
    if (this.state.currentViewId === HelpModal.id) {
      contentView = helpModal()
    } else if (this.state.currentViewId === AddLocationView.id) {
      contentView = <AddLocationView />
    } else if (this.state.locations.length === 0) {
      contentView = noLocationsModal()
    } else if (this.state.currentViewId === WeatherSummaryView.id) {
      contentView = weatherSummaryView()
    } else if (this.state.currentViewId === EditLocationsView.id) {
      contentView = editLocationsView()
    } else {
      contentView = helpModal()
    }

    return <div id='app'>
      <h1 id='header'>
        <span id='title'>U.S. weather</span>
        <ToolBar />
      </h1>

      <div id='content'>
        {contentView}
      </div>
    </div>
  }
}

function helpModal () { return <Scrollable> <HelpModal /> </Scrollable> }
function noLocationsModal () { return <Scrollable> <NoLocationsModal /> </Scrollable> }
function weatherSummaryView () { return <Scrollable> <WeatherSummaryView /> </Scrollable> }
function editLocationsView () { return <Scrollable> <EditLocationsView /> </Scrollable> }

function setupWeatherUpdates () {
  setImmediate(update)
  setInterval(update, 1000 * 60 * 60)

  function update () {
    Store.updateWeatherInfoIfNeeded()
  }
}

class Scrollable extends React.Component {
  render () {
    return <div className='y-scrollable'>
      {this.props.children}
    </div>
  }
}
