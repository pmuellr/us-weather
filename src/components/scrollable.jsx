'use strict'

import React, { useRef, useLayoutEffect } from 'react'

export default function Scrollable (props) {
  const div = useRef(null)

  // set focus so we can scroll with cursor keys
  useLayoutEffect(() =>
    div.current.focus()
  )

  return (
    <div className='y-scrollable' ref={div} tabIndex='0' onClick={props.onClick}>
      {props.children}
    </div>
  )
}
