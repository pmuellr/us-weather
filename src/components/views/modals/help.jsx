'use strict'

import React from 'react'

import Modal from './modal.jsx'

export default class HelpModal extends Modal {
  render () {
    return <div>

      <p><a href='javascript:window.location.reload()'>Click here to reload the app.</a></p>

      <p>
        The source for this app is available at Github:&nbsp;
        <a href='https://github.com/pmuellr/us-weather'>https://github.com/pmuellr/us-weather</a>
      </p>

      <p>
        Some links to the weather service APIs:
        <ul>
          <li>
            <a href='https://api.weather.gov/points/35.70539,-78.7963'>
              https://api.weather.gov/points/35.70539,-78.7963
            </a>
          </li>

          <li>
            <a href='https://forecast-v3.weather.gov/documentation'>
              https://forecast-v3.weather.gov/documentation
            </a>
          </li>
        </ul>
      </p>

    </div>
  }
}

HelpModal.id = 'help-modal'
