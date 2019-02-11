'use strict'

import React from 'react'

import ToolBarIcon from './tool-bar-icon.jsx'

export default function ToolBar (props) {
  return (
    <div id='tool-icons' className='tool-icons'>
      <ToolBarIcon icon='wb_sunny' pageId='weather-summary' title='display weather summary' />
      <ToolBarIcon icon='add_location' pageId='add-location' title='add a location' />
      <ToolBarIcon icon='help' pageId='help' title='help' />
    </div>
  )
}
