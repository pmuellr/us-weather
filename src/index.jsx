'use strict'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './components/app.jsx'

if (document.readyState === 'loading') {
  window.addEventListener('load', onLoad)
} else {
  onLoad()
}

async function onLoad () {
  const isLocalHost = (window.location.hostname === 'localhost')
  if (!isLocalHost) registerServiceWorker()

  ReactDOM.render(
    <App />,
    document.getElementById('app-wrapper')
  )
}

/** @type { ServiceWorkerRegistration } */
let serviceWorkerRegistration

async function registerServiceWorker () {
  const activity = 'registering service worker'
  console.log(activity)

  if (navigator.serviceWorker == null) {
    console.log(`${activity}: serviceWorker not available`)
    return
  }

  try {
    serviceWorkerRegistration = await navigator.serviceWorker.register('service-worker.js')
    console.log(`${activity}: success: `, serviceWorkerRegistration)
  } catch (err) {
    console.log(`${activity}: error:,`, err)
  }
}

window.updateServiceWorker = async function () {
  const activity = 'manually updating service worker'
  console.log(activity)

  if (!serviceWorkerRegistration) {
    console.log(`${activity}: registration not set`)
    return
  }

  try {
    const updateResponse = await serviceWorkerRegistration.update()
    console.log(`${activity}: success: `, updateResponse)
  } catch (err) {
    console.log(`${activity}: error:`, err)
  }
}
