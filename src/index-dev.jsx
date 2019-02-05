'use strict'

import './index.jsx'

if (document.readyState === 'loading') {
  window.addEventListener('load', onLoad)
} else {
  onLoad()
}

async function onLoad () {
  const body = document.getElementById('body')
  const bodyClasses = body.classList

  bodyClasses.add('dev-mode')
}
