'use strict'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './components/app.jsx'

const TRY_USING_SERVICE_WORKER = false

if (document.readyState === 'loading') {
  window.addEventListener('load', onLoad)
} else {
  onLoad()
}

async function onLoad () {
  if (TRY_USING_SERVICE_WORKER) registerServiceWorker()

  ReactDOM.render(
    <App />,
    document.getElementById('app-wrapper')
  )
}

async function registerServiceWorker () {
  if (navigator.serviceWorker == null) return

  try {
    var registration = navigator.serviceWorker.register('/service-worker.js')
  } catch (err) {
    console.log(`service worker registration failed: ${err.message}`)
    return
  }

  console.log(`service worker registered with scope: ${registration.scope}`)
}
