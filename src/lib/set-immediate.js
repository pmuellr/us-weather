'use strict'

export default function setImmediate (fn, ...args) {
  setTimeout(runFn, 0)

  function runFn () {
    fn(...args)
  }
}
