'use strict'

/* global self, caches, fetch */

const CACHE_NAME = 'my-site-cache-v1'

var urlsToCache = [
  '/',
  'index.css',
  'icon?family=Material+Icons',
  'main.js',
  'manifest.webmanifest',
  'us-weather.png'
]

const TRY_USING_SERVICE_WORKER_ARGHHH = false

if (TRY_USING_SERVICE_WORKER_ARGHHH) {
  self.addEventListener('install', onInstall)
  self.addEventListener('fetch', onFetch)
}

function onInstall (event) {
  event.waitUntil(openCaches)
}

function onFetch (event) {
  event.respondWith(() => attemptFetch(event))
}

async function attemptFetch (event) {
  const promise = caches.match(event.request)

  try {
    var response = await promise
  } catch (err) {
    console.log(`error fetching cached request: ${event.request} ${err.message}`)
    return promise
  }

  if (response != null) {
    console.log(`returning cached response: ${event.request}`)
    return response
  }

  console.log(`request not cached, fetching from scratch: ${event.request}`)
  return fetch(event.request)
}

async function openCaches () {
  const promise = caches.open(CACHE_NAME)

  try {
    var cache = await promise
  } catch (err) {
    console.log(`error opening caches: ${err.message}`)
    return promise
  }

  console.log(`opened caches`)
  cache.addAll(urlsToCache)
  return promise
}
