#!/usr/bin/env node

'use strict'

const fs = require('fs')
const path = require('path')

const projectPath = path.dirname(__dirname)

const version = new Date().toISOString()

updateFile(
  path.join(projectPath, 'src', 'build-info.js'),
  path.join(projectPath, 'docs', 'build-info.js'),
  /%built-on-date%/g,
  version
)

updateFile(
  path.join(projectPath, 'src', 'service-worker.js'),
  path.join(projectPath, 'docs', 'service-worker.js'),
  /%built-on-date%/g,
  version
)

function updateFile (iFileName, oFileName, pattern, replacement) {
  let contents = fs.readFileSync(iFileName, 'utf8')
  contents = contents.replace(pattern, replacement)
  fs.writeFileSync(oFileName, contents)

  console.log(`updated ${oFileName} with latest build info`)
}
