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

      <p>
        After adding a location or two, come back to this page by clicking the
        <span className='tool-icons'>
          <ToolBarIcon icon='wb_sunny' title='display weather summary' />
        </span>
        button in the toolbar above, to see the locations' weather summaries.
      </p>

      <p>
        Then visit the help page by clicking the
        <span className='tool-icons'>
          <ToolBarIcon icon='help' title='help' />
        </span>
        button in the toolbar above, to get more information about this app.
      </p>
    </Scrollable>
  )
}
