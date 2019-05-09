const glob = require('glob')
const fs = require('fs')

module.exports = (api, options) => {

  api.configureWebpack(config => {
    // If this is a SPA mode then we want to use the main-drupal.js file.
    const path = api.service.context + '/src/main-drupal.js'
    try {
      if (fs.existsSync(path) && config.mode !== 'development') {
        config.entry = { app: ['./src/main-drupal.js'] }
      }
    } catch (err) {
    }
  })

  api.chainWebpack(config => {
    // Exclude the Vue library since Drupal is already adding it globally.
    const mode = config.store.get('mode')
    if (mode !== 'development') {
      config.externals({
        ...config.get('externals'),
        'vue': 'Vue',
        'vuex': 'Vuex',
        'jquery': 'jQuery',
      })
    }
  })

}

module.exports.singleInstances = () => {
  let pages = {}
  const files = glob.sync('./blocks/**/main.js')

  files.forEach(file => {
    const regex = /blocks\/([^/]+)\/main/
    const found = file.match(regex)
    const pageName = found[1]

    if (pageName) {
      pages[pageName] = {
        entry: file,
      }
    }
  })

  return pages
}
