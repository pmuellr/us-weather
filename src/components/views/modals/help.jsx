'use strict'

import React from 'react'

import Modal from './modal.jsx'
import ToolBarIcon from '../../tool-bar-icon.jsx'

export default class HelpModal extends Modal {
  render () {
    return <div>

      <h3>toolbar icons</h3>

      <div className='tool-icons'>
        <p>
          <ToolBarIcon icon='wb_sunny' title='display weather summary' />
          displays weather information
        </p>
        <p>
          <ToolBarIcon icon='add_location' title='add a location' />
          adds a location
        </p>
        <p>
          <ToolBarIcon icon='edit_location' title='edit locations' />
          edit existing locations
        </p>
        <p>
          <ToolBarIcon icon='help' title='help' />
          display this help
        </p>
      </div>

      <h3>switching between locations</h3>

      <p>
        When displaying weather information, you can change the location by
        clicking on the left-hand or right-hand side of the web page - moving
        through the list of locations backwards and forwards, respectively.
      </p>

      <p>
        The location can also be changed by using the left and right "arrow"
        keys on the keyboard.
      </p>

      <h3>etc</h3>

      <p><a href='javascript:window.location.reload()'>Click here to reload the app.</a></p>

      <p>
        The source for this app is available at Github:&nbsp;
        <a href='https://github.com/pmuellr/us-weather'>https://github.com/pmuellr/us-weather</a>
      </p>

      <p>
        Some links to the National Weather Service APIs:
      </p>

      <ul>
        <li>
          <p>meta-data for a particular geographic location<br />
            <a href='https://api.weather.gov/points/35.70539,-78.7963'>
              https://api.weather.gov/points/35.70539,-78.7963
            </a></p>
        </li>

        <li>
          <p>documentation on the APIs:<br />
            <a href='https://forecast-v3.weather.gov/documentation'>
              https://forecast-v3.weather.gov/documentation
            </a></p>
        </li>
      </ul>

    </div>
  }
}

HelpModal.id = 'help-modal'
