'use strict'

import React from 'react'

import Modal from './modal.jsx'

export default class NoLocationsModal extends Modal {
  render () {
    return <div>
      <p>You haven't added any locations yet.</p>

      <p>
        Add one by clicking the
        <i className='material-icons'>add_location</i>
        button in the toolbar above.
      </p>
    </div>
  }
}

NoLocationsModal.id = 'no-locations-modal'
