const { renameFile, convertToHyphenCase, addInstanceToIndex, renameMountPoint, renameBlocksDir } = require('../../lib/generator-helpers')

module.exports = (api, options) => {
  const originalBlocksDir = 'blocks/example/'
  const newBlocksDir = 'blocks/' + options.blockMachineName + '/'

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
    blockMachineNameHyphen: convertToHyphenCase(options.blockMachineName)
  })

  api.postProcessFiles(files => {
    // Rename the info.yml files.
    renameFile(files, originalBlocksDir + 'example.info.yml', originalBlocksDir + options.blockMachineName + '.info.yml')

    // Rename the new block directory files.
    renameBlocksDir(files, originalBlocksDir, newBlocksDir)
  })

  api.onCreateComplete(() => {
    // Rename the mount point from #app.
    renameMountPoint(options)

    // Add the new instance div into the index.html file.
    addInstanceToIndex(options)
  })
}
