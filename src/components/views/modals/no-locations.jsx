'use strict'

import React from 'react'

import Modal from './modal.jsx'
import ToolBarIcon from '../../tool-bar-icon.jsx'

export default class NoLocationsModal extends Modal {
  render () {
    return <div>
      <p>You haven't added any locations yet.</p>

      <p>
        Add one by clicking the
        <span className='tool-icons'>
          <ToolBarIcon icon='add_location' title='add a location' />
        </span>
        button in the toolbar above.
      </p>
    </div>
  }
}

NoLocationsModal.id = 'no-locations-modal'
