module.exports = (api, options) => {
  api.extendPackage({
    pdbVue: {
      drupalModule: options.drupalModuleMachineName,
      mode: options.mode,
    },
  })

  if (options.mode === 'instances') {
    require('./instances')(api, options)
  }

  if (options.mode === 'spa') {
    require('./spa')(api, options)
  }
}
