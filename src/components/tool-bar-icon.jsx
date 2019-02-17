'use strict'

import React from 'react'

import Store from '../lib/store'

export default function ToolBarIcon (props) {
  const imageURL = `images/material-design/ic_${props.icon}_black_48dp.png`

  return (
    <button onClick={handleClick} className={`icon-${props.icon}`}>
      <img src={imageURL} title={props.title} className='toolbar-icon' />
    </button>
  )

  function handleClick () {
    if (props.pageId == null) return
    Store.setCurrentPageId(props.pageId)
  }
}
