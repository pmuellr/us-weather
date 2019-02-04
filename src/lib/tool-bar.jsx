'use strict'

import React from 'react'

export default class ToolBar extends React.Component {
  render () {
    return <div id='tool-icons'>
      <ToolBarIcon name='cloud' />
      <ToolBarIcon name='list' />
      <ToolBarIcon name='add_location' />
      <ToolBarIcon name='edit_location' />
      <ToolBarIcon name='help' />
    </div>
  }
}

class ToolBarIcon extends React.Component {
  render () {
    return <button>
      <i class='material-icons'>{this.props.name}</i>
    </button>
  }
}
