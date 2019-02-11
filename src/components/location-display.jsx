'use strict'

import React from 'react'

export default function LocationDisplay (props) {
  const { name, elevation, lat, lng } = props.location

  let updatedAt = props.updatedAt
  if (updatedAt != null) {
    updatedAt = <span><br />last updated at {niceDate(updatedAt)}</span>
  }

  return (
    <div className='location-display'>
      <h3 className='location-display-name'>{name}</h3>
      <div className='location-display-details'>
        elevation: {elevation} ft;  geo: {lat},{lng}
        {updatedAt}
      </div>
      <hr />
    </div>
  )
}

function niceDate (isoDate) {
  const date = new Date(isoDate)
  const month = Months[date.getMonth()]
  const day = date.getDate()
  const dow = Days[date.getDay()]
  const hour = `${date.getHours()}`.padStart(2, '0')
  const minute = `${date.getMinutes()}`.padStart(2, '0')

  return `${dow}, ${month} ${day} at ${hour}:${minute}`
}

const Months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ')
const Days = 'Sun Mon Tue Wed Thu Fri Sat'.split(' ')
