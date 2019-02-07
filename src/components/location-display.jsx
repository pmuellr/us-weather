'use strict'

import React from 'react'

export default class LocationDisplay extends React.Component {
  render () {
    const { name, elevation, lat, lng } = this.props.location

    let extraDetails = null
    if (this.props.extraDetails) {
      extraDetails = <span><br />{this.props.extraDetails}</span>
    }

    return <div className='location-display'>
      <h3 className='location-display-name'>{name}</h3>
      <div className='location-display-details'>
        elevation: {elevation} ft;  geo: {lat},{lng}
        {extraDetails}
      </div>
    </div>
  }
}
