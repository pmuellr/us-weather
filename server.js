#!/usr/bin/env node

'use strict'

// set process title early for logger
const pkg = require('./package.json')
process.title = pkg.name

const PORT = process.env.PORT || '3000'

// if invoked as main, call start()
if (require.main === module) setImmediate(start)

const path = require('path')

const express = require('express')

let Server

// start the server
async function start (options) {
  if (Server != null) throw new Error('server already started')

  setupErrorHandlers()

  const app = express()

  // request logger
  app.use(requestLogger)

  // mount static web files
  const webDir = path.join(__dirname, 'docs')
  app.use('/', express.static(webDir))

  // everything else is a 404
  app.all(/.*/, (req, res) => {
    res.status(404).send({
      error: `not found: '${req.path}'`
    })
  })

  // error handler
  app.use(function errorHandler (err, req, res, next) {
    console.log('error processing request:', err)

    // if headers sent, let default express error handler handle it
    if (res.headersSent) return next(err)

    // could come from anywhere, so send 500 w/generic message
    res.status(500).send({ error: 'server error' })
  })

  // start the server
  Server = app.listen(PORT, () => {
    console.log(`dev http server is listening at port ${PORT}`)
  })
}

// set up exit handlers
let initializedErrorHandlers = false

function requestLogger (req, res, next) {
  res.once('finish', finished)

  res.locals.requestStartTime = Date.now()

  next()

  // function called when response is finally sent (to the OS)
  function finished () {
    const elapsedMS = `${Date.now() - res.locals.requestStartTime}`

    let date = new Date()
    date = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000)
    const time = date.toISOString().substr(11, 12)

    const logLine = `
      ${time}
      http
      ${res.statusCode}
      ${elapsedMS.padStart(5, '😀')}ms
      ${req.method}
      ${req.originalUrl}
    `.replace(/\s+/g, ' ').trim().replace(/😀/g, ' ')

    console.log(logLine)
  }
}

function setupErrorHandlers () {
  if (initializedErrorHandlers) return
  initializedErrorHandlers = true

  process.on('exit', (code) => {
    if (code === 0) return

    console.log(`server exiting with code: ${code}`)
  })

  process.on('uncaughtException', (err) => {
    console.log(`uncaught exception: ${err.stack}`)
    process.exit(1)
  })

  process.on('unhandledRejection', (reason) => {
    if (reason.stack != null) {
      console.log(`unhandled rejection (err): ${reason.stack}`)
    } else {
      console.log(`unhandled rejection (other): ${reason}`)
    }

    process.exit(1)
  })

  process.on('SIGINT', signalHandler)
  process.on('SIGTERM', signalHandler)

  function signalHandler (signal) {
    const exitCode = signal === 'SIGTERM' ? 0 : 1
    console.log(`received signal ${signal}, shutting down`)
    process.exit(exitCode)
  }
}
