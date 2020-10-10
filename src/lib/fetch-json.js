'use strict'

/* global fetch */

const MAX_ATTEMPTS = 3

// get the json from a url
/** @type { (url: string) => Record<string, unknown> } */
export default async function fetchJSON (url) {
  let attempt = 1
  let lastError

  console.warn(`fetchJSON("${url}") started`)

  while (attempt <= MAX_ATTEMPTS) {
    const result = fetchJSONOnce(url)
    if (result && result.error == null) {
      return result
    }

    lastError = result
    console.warn(`fetchJSON("${url}") err: ${lastError.error}; attempt ${attempt}/${MAX_ATTEMPTS}`)
    attempt++
  }

  return lastError
}

/** @type { (url: string) => Record<string, unknown> } */
async function fetchJSONOnce (url) {
  let response
  try {
    response = await fetch(url)
  } catch (err) {
    return { error: `error fetching ${url}: ${err.message}` }
  }

  const status = response.status
  if (status >= 400 && status < 500) {
    return { error: `error fetching ${url}: status ${status}` }
  }

  let result
  try {
    result = await response.json()
  } catch (err) {
    return { error: `error parsing json from ${url}: ${err.message}` }
  }

  return result
}
