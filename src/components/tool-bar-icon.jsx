'use strict'

import React from 'react'

import Store from '../lib/store'

export default class ToolBarIcon extends React.Component {
  render () {
    const imageURL = `images/material-design/ic_${this.props.icon}_black_48dp.png`

    return <button onClick={() => this.handleClick()}>
      <img src={imageURL} title={this.props.title} className='toolbar-icon' />
    </button>
  }

  handleClick () {
    if (this.props.viewId == null) return
    Store.setCurrentViewId(this.props.viewId)
  }
}
