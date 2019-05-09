const { EOL } = require('os')
const fs = require('fs')
const lineRegex = /\r?\n/g

const renameFile = (files, oldName, newName) => {
  if (newName !== oldName) {
    Object.defineProperty(files, newName,
      Object.getOwnPropertyDescriptor(files, oldName))
    delete files[oldName]
  }
}
module.exports.renameFile = renameFile

const convertToHyphenCase = (item) => item.replace(/[_\s]/g, '-').toLowerCase()
module.exports.convertToHyphenCase = convertToHyphenCase

const convertToPascalCase = (item) => {
  const camelCase = item.replace(/[-_\s](\w)/g, (match => match[1].toUpperCase()))
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1)
}
module.exports.convertToPascalCase = convertToPascalCase

module.exports.addInstanceToIndex = (options) => {
  const indexFile = 'public/index.html'
  const content = fs.readFileSync(indexFile, { encoding: 'utf-8' })

  const lines = content.split(lineRegex)

  const html = `    <div class="${convertToHyphenCase(options.blockMachineName)}"></div>`

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

  // Add a link to the html page.
  const linkIndex = lines.findIndex(line => line.match(/<\/noscript>/))
  if (linkIndex !== -1) {
    lines[linkIndex] += `${EOL}    <a href="${options.blockMachineName}.html">${options.blockMachineName}</a>`
  }

  fs.writeFileSync(indexFile, lines.join(EOL), { encoding: 'utf-8' })
}

module.exports.renameMountPoint = (options) => {
  const entryFile = `blocks/${options.blockMachineName}/main.js`
  const contentMain = fs.readFileSync(entryFile, { encoding: 'utf-8' })

  const lines = contentMain.split(lineRegex)

  const mountIndex = lines.findIndex(line => line.match(/#app/))
  if (mountIndex !== -1) {
    lines[mountIndex] = lines[mountIndex].replace('#app', '.' + convertToHyphenCase(options.blockMachineName))
  }

  fs.writeFileSync(entryFile, lines.join(EOL), { encoding: 'utf-8' })
}

module.exports.renameBlocksDir = (files, oldDir, newDir) => {
  if (oldDir !== newDir) {
    const keys = Object.keys(files)
    const changeKeys = keys.filter(item => item.includes(oldDir))

    changeKeys.forEach(item => {
      const newName = item.replace(oldDir, newDir)
      renameFile(files, item, newName)
    })
  }
}

module.exports.registerGlobalComponent = (options) => {
  const blockComponentName = convertToPascalCase(options.blockMachineName)

  const entryFile = 'src/main-drupal.js'
  const contentMain = fs.readFileSync(entryFile, { encoding: 'utf-8' })

  const lines = contentMain.split(lineRegex)

  const componentImport = `import ${blockComponentName} from './components/${blockComponentName}'`

  // First check to see if the html is already present
  const htmlIndex = lines.findIndex(line => line.match(componentImport))
  // Exit if the html is already in the file.
  if (htmlIndex !== -1) {
    return
  }

  const importIndex = lines.findIndex(line => line.match(/Import each block/))
  if (importIndex !== -1) {
    lines[importIndex] += EOL + componentImport
  }

  const componentRegister = `Vue.component('${convertToHyphenCase(options.blockMachineName)}', ${blockComponentName})`

  const registerIndex = lines.findIndex(line => line.match(/Register Global/))
  if (registerIndex !== -1) {
    lines[registerIndex] += EOL + componentRegister
  }

  fs.writeFileSync(entryFile, lines.join(EOL), { encoding: 'utf-8' })
}

module.exports.addComponentToApp = (options) => {
  const blockComponentName = convertToPascalCase(options.blockMachineName)

  const entryFile = 'src/App.vue'
  const contentMain = fs.readFileSync(entryFile, { encoding: 'utf-8' })

  const lines = contentMain.split(lineRegex)

  // First check to see if the html is already present
  const htmlIndex = lines.findIndex(line => line.match(blockComponentName))
  // Exit if the html is already in the file.
  if (htmlIndex !== -1) {
    return
  }

  // Add the element into the template.
  const componentElement = `    <${blockComponentName} msg="Welcome to Your ${options.blockName} PDB Vue.js App"/>`

  const elementIndex = lines.findIndex(line => line.match(/<\/div>/))
  if (elementIndex !== -1) {
    lines[elementIndex - 1] += EOL + componentElement
  }

  // Import the component.
  const componentImport = `import ${blockComponentName} from './components/${blockComponentName}'`

  const importIndex = lines.findIndex(line => line.match(/<script>/))
  if (importIndex !== -1) {
    lines[importIndex] += EOL + componentImport
  }

  // Register the component.
  const componentRegister = `    ${blockComponentName},`

  const registerIndex = lines.findIndex(line => line.match(/components: {/))
  if (registerIndex !== -1) {
    lines[registerIndex] += EOL + componentRegister
  }

  fs.writeFileSync(entryFile, lines.join(EOL), { encoding: 'utf-8' })
}