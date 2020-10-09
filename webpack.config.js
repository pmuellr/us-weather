'use strict'

const path = require('path')

module.exports = env => {
  let mode = 'production'
  let entryFile = './src/index.jsx'

  if (env && env.development) {
    mode = 'development'
    entryFile = './src/index-dev.jsx'
  }

  console.log(`mode: ${mode}`)

  return {
    entry: entryFile,
    optimization: {
      minimize: false
    },
    output: {
      path: path.resolve(__dirname, 'docs'),
      filename: 'main.js'
    },
    mode,
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.jsx$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    }
  }
}
