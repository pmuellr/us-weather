'use strict'

// round a number to the specified number of decimal points
export default function round (number, decimals = 0) {
  if (decimals === 0) return Math.round(number)

  const scalar = Math.pow(10, decimals)
  return Math.round(number * scalar) / scalar
}
