'use strict'

import React from 'react'

export default function Scrollable (props) {
  return (
    <div className='y-scrollable' onClick={props.onClick}>
      {props.children}
    </div>
  )
}
