'use strict'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './lib/app.jsx'

if (document.readyState === 'loading') {
  window.addEventListener('load', onLoad)
} else {
  onLoad()
}

function onLoad () {
  ReactDOM.render(
    <App />,
    document.getElementById('body')
  )
}
