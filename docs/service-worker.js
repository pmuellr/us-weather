'use strict'

/* global self, caches, fetch */

// see: https://gist.github.com/kosamari/7c5d1e8449b2fbc97d372675f16b566e

const PATH_PREFIX = getPathPrefix()

// Identifier for this app (this needs to be consistent across every cache update)
const APP_PREFIX = 'US_Weather'

// Version of the off-line cache (change this value everytime you want to update cache)
const VERSION = '2020-10-09T19:27:37.983Z'

const CACHE_NAME = `${APP_PREFIX}_${VERSION}`

const URLS = [
  `${PATH_PREFIX}/build-info.js`,
  `${PATH_PREFIX}/index.html`,
  `${PATH_PREFIX}/index.css`,
  `${PATH_PREFIX}/leaflet.css`,
  `${PATH_PREFIX}/main.js`,
  `${PATH_PREFIX}/manifest.webmanifest`,
  `${PATH_PREFIX}/images/layers-2x.png`,
  `${PATH_PREFIX}/images/layers.png`,
  `${PATH_PREFIX}/images/marker-icon-2x.png`,
  `${PATH_PREFIX}/images/marker-icon.png`,
  `${PATH_PREFIX}/images/marker-shadow.png`,
  `${PATH_PREFIX}/images/us-weather.png`,
  `${PATH_PREFIX}/images/material-design/ic_add_location_black_48dp.png`,
  `${PATH_PREFIX}/images/material-design/ic_edit_location_black_48dp.png`,
  `${PATH_PREFIX}/images/material-design/ic_help_black_48dp.png`,
  `${PATH_PREFIX}/images/material-design/ic_show_chart_black_48dp.png`,
  `${PATH_PREFIX}/images/material-design/ic_star_black_48dp.png`,
  `${PATH_PREFIX}/images/material-design/ic_text_format_black_48dp.png`,
  `${PATH_PREFIX}/images/material-design/ic_wb_sunny_black_48dp.png`,
  `${PATH_PREFIX}/`
]

// Respond with cached resources
self.addEventListener('fetch', function (e) {
  console.log('fetch request : ' + e.request.url)
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) { // if cache is available, respond with cache
        console.log('responding with cache : ' + e.request.url)
        return request
      } else {
        // if there are no cache, try fetching request
        console.log('file is not cached, fetching : ' + e.request.url)
        return fetch(e.request)
      }

      // You can omit if/else for console.log & put one line below like this too.
      // return request || fetch(e.request)
    })
  )
})

// Cache resources
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache : ' + CACHE_NAME)
      return cache.addAll(URLS)
    })
  )
})

// Delete outdated caches
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      // `keyList` contains all cache names under your username.github.io
      // filter out ones that has this app prefix to create white list
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX)
      })
      // add current cache name to white list
      cacheWhitelist.push(CACHE_NAME)

      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('deleting cache : ' + keyList[i])
          return caches.delete(keyList[i])
        }
      }))
    })
  )
})

// Return the path prefix of this service worker.
// eg https://host.name/service-worker.js   => ''
// eg https://host.name/a/service-worker.js => '/a'
function getPathPrefix () {
  const serviceWorkerPath = self.location.pathname

  const match = serviceWorkerPath.match(/^(.*)\/.*$/)
  if (match == null) {
    console.log('unable to determine app path prefix, using ""')
    return ''
  }

  return match[1]
}
