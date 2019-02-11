'use strict'

import React from 'react'

import Scrollable from '../scrollable.jsx'
import ToolBarIcon from '../tool-bar-icon.jsx'

export default function NoLocationsPage (props) {
  return (
    <Scrollable>
      <p>You haven't added any locations yet.</p>

      <p>
        Add one by clicking the
        <span className='tool-icons'>
          <ToolBarIcon icon='add_location' title='add a location' />
        </span>
        button in the toolbar above.
      </p>
    </Scrollable>
  )
}
