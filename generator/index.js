const { EOL } = require('os')
const fs = require('fs')

const renameFile = (files, oldName, newName) => {
  if (newName !== oldName) {
    Object.defineProperty(files, newName,
      Object.getOwnPropertyDescriptor(files, oldName))
    delete files[oldName]
  }
}

const replaceUnderscore = (item) => item.replace('_', '-')

const addInstanceToIndex = (options) => {
  const indexFile = 'public/index.html'
  const content = fs.readFileSync(indexFile, { encoding: 'utf-8' })

  const lines = content.split(/\r?\n/g)

  const html = `    <div class="${replaceUnderscore(options.blockMachineName)}"></div>`

  // First check to see if the html is already present
  const htmlIndex = lines.findIndex(line => line.match(html))
  // Exit if the html is already in the file.
  if (htmlIndex !== -1) {
    return
  }

  const mountIndex = lines.findIndex(line => line.match(/<!-- built files/))
  // Exit if the mount point can't be found.
  if (mountIndex === -1) {
    return
  }

  lines[mountIndex - 1] += EOL + html
  fs.writeFileSync(indexFile, lines.join(EOL), { encoding: 'utf-8' })
}

const renameMountPoint = (options) => {
  const entryFile = `blocks/${options.blockMachineName}/main.js`
  const contentMain = fs.readFileSync(entryFile, { encoding: 'utf-8' })

  const lines = contentMain.split(/\r?\n/g)

  const mountIndex = lines.findIndex(line => line.match(/#app/))
  if (mountIndex !== -1) {
    lines[mountIndex] = lines[mountIndex].replace('#app', '.' + replaceUnderscore(options.blockMachineName))
  }

  fs.writeFileSync(entryFile, lines.join(EOL), { encoding: 'utf-8' })
}

module.exports = (api, options) => {

  // Disable filename hashing.
  api.extendPackage({
    vue: {
      filenameHashing: false,
    },
  })

  if (options.singleInstance) {
    // Generate the files.
    api.render('./template', {
      ...options,
    })

    api.postProcessFiles(files => {
      const originalBlocksDir = 'blocks/hello_world/'
      const newBlocksDir = 'blocks/' + options.blockMachineName + '/'

      // Rename the yml files.
      renameFile(files, originalBlocksDir + 'hello_world.info.yml', originalBlocksDir + options.blockMachineName + '.info.yml')
      renameFile(files, 'pdb_vue.libraries.yml', options.drupalModuleMachineName + '.libraries.yml')

      // Rename the new block directory files.
      if (originalBlocksDir !== newBlocksDir) {
        const keys = Object.keys(files)
        console.log(keys)

        const changeKeys = keys.filter(item => item.includes(originalBlocksDir))

        changeKeys.forEach(item => {
          const newName = item.replace(originalBlocksDir, newBlocksDir)
          renameFile(files, item, newName)
        })
      }
    })

    api.onCreateComplete(() => {
      // Rename the mount point from #app.
      renameMountPoint(options)

      // Add the new instance div into the index.html file.
      addInstanceToIndex(options)
    })

  } else {
    // Generate the files.
    api.render('./template_spa')
  }

}
