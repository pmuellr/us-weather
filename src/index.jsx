'use strict'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './components/app.jsx'

const TRY_USING_SERVICE_WORKER = true

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

  navigator.serviceWorker.register('/us-weather/service-worker.js', { scope: '/us-weather/' })
}
