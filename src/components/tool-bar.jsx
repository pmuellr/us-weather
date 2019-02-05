'use strict'

import React from 'react'

import Store from '../lib/store'

import WeatherSummaryView from './views/weather-summary.jsx'
import AddLocationView from './views/add-location.jsx'
import EditLocationsView from './views/edit-locations.jsx'
import HelpModal from './views/modals/help.jsx'

export default class ToolBar extends React.Component {
  render () {
    return <div id='tool-icons'>
      <ToolBarIcon icon='list' viewId={WeatherSummaryView.id} title='display weather summary' />
      <ToolBarIcon icon='add_location' viewId={AddLocationView.id} title='add a location' />
      <ToolBarIcon icon='edit_location' viewId={EditLocationsView.id} title='edit locations' />
      <ToolBarIcon icon='help' viewId={HelpModal.id} title='help' />
    </div>
  }

  // <ToolBarIcon icon='cloud' viewId={WeatherSummaryView.id} title='display weather chart' />
}

class ToolBarIcon extends React.Component {
  render () {
    return <button onClick={() => this.handleClick()}>
      <i className='material-icons'>{this.props.icon}</i>
    </button>
  }

  handleClick () {
    Store.setCurrentViewId(this.props.viewId)
  }
}
