'use script'

/* global c3, fetch */

export async function buildCharts () {
  const data = await getJSON('/api/v1/forecast/time-series?location=35.70539,-78.7963')

  buildChart('#chart1', data, ['temperature', 'windChill'])
  buildChart('#chart2', data, ['probabilityOfPrecipitation', 'skyCover'])
  buildChart('#chart3', data, ['quantitativePrecipitation', 'snowfallAmount', 'iceAccumulation'])
  buildChart('#chart4', data, ['windSpeed'])
}

async function buildChart (id, data, properties) {
  const columns = []

  for (const property of properties) {
    const values = getDataForProperty(data, property)
    values.unshift(property)
    columns.push(values)
  }

  c3.generate({
    bindto: id,
    data: {
      columns,
      type: 'spline'
    },
    point: { show: false },
    grid: {
      x: { show: true },
      y: { show: true }
    },
    axis: {
      y: {
        tick: {
          count: 4
        }
      }
    }
  })
}

function getDataForProperty (data, property) {
  for (const propertyObject of data.properties) {
    if (propertyObject.property === property) return propertyObject.data
  }
  return []
}

// get the json from a url
async function getJSON (url) {
  try {
    var response = await fetch(url)
  } catch (err) {
    return { error: `error fetching ${url}: ${err.message}` }
  }

  if (response.status >= 400 && response.status < 500) {
    return null
  }

  try {
    var result = await response.json()
  } catch (err) {
    return { error: `error parsing json from ${url}: ${err.message}` }
  }

  return result
}

// build chart on window load
// if (document.readyState === 'loading') {
//   window.addEventListener('load', buildCharts)
// } else {
//   buildCharts()
// }
