#!/usr/bin/env node

'use strict'

const fs = require('fs')
const path = require('path')

const projectPath = path.dirname(__dirname)

const iFile = path.join(projectPath, 'src', 'service-worker.js')
const oFile = path.join(projectPath, 'docs', 'service-worker.js')

const version = new Date().toISOString()
let contents = fs.readFileSync(iFile, 'utf8')
contents = contents.replace(/%service-worker-cache-version%/g, version)
fs.writeFileSync(oFile, contents)

console.log(`updated ${oFile} with new cache version`)
