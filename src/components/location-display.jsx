'use strict'

import React from 'react'

export default class LocationDisplay extends React.Component {
  render () {
    const { name, elevation, lat, lng } = this.props.location

    return <div className='location-display'>
      <h3 className='location-display-name'>{name}</h3>
      <div className='location-display-details'>
        elevation {elevation} ft; {lat}, {lng}
      </div>
    </div>
  }
}
