const entryPlus = require('webpack-entry-plus')
const glob = require('glob')

const entryFiles = [
  {
    entryFiles: glob.sync('./blocks/**/main.js'),
    outputName (item) {
      const regex = /blocks\/([^/]+)\/main/
      const found = item.match(regex)
      return item = found[1]
    },
  },
]

module.exports = (api, options) => {

  api.configureWebpack(config => {
    config.entry = entryPlus(entryFiles)
  })

  api.chainWebpack(config => {
    // config.optimization.splitChunks(false)

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
