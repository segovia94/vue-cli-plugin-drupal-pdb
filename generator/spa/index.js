const { renameFile, addComponentToApp, convertToHyphenCase, convertToPascalCase, registerGlobalComponent } = require('../../lib/generator-helpers')

module.exports = (api, options) => {
  const blockComponentName = convertToPascalCase(options.blockMachineName)

  // Generate the Framework files.
  if (options.generate === 'whole') {
    api.render('./template_framework', {
      ...options,
    })

    api.postProcessFiles(files => {
      // Rename the libraries.yml files.
      renameFile(files, 'pdb_vue.libraries.yml', options.drupalModuleMachineName + '.libraries.yml')
    })
  }

  // New block.
  api.render('./template_block', {
    ...options,
    blockComponentName,
    blockMachineNameHyphen: convertToHyphenCase(options.blockMachineName)
  })

  api.postProcessFiles(files => {
    // Rename the info.yml files.
    renameFile(files, 'blocks/example.info.yml', 'blocks/' + options.blockMachineName + '.info.yml')
    // Rename the vue component.
    renameFile(files, 'src/components/example.vue', 'src/components/' + blockComponentName + '.vue')
  })

  api.onCreateComplete(() => {
    // Register the block as a global component.
    registerGlobalComponent(options)
    // Add the block to the main App.js file used in development.
    addComponentToApp(options)
  })
}
