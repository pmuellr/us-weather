'use strict'

class DateCalculator {
  // return dateA - dateB in hours
  hoursDifference (dateA, dateB) {
    if (typeof dateA === 'string') dateA = new Date(dateA)
    if (typeof dateA === 'number') dateA = new Date(dateA)

    if (typeof dateB === 'string') dateB = new Date(dateB)
    if (typeof dateB === 'number') dateB = new Date(dateB)

    const millisA = dateA.getTime()
    const millisB = dateB.getTime()

    return (millisA - millisB) / MILLIS_IN_AN_HOUR
  }

  // return dateA - dateB in hours
  hoursDifferenceFromNow (dateA) {
    return this.hoursDifference(new Date(), dateA)
  }
}

export default new DateCalculator()

const MILLIS_IN_AN_HOUR = 1000 * 60 * 60
