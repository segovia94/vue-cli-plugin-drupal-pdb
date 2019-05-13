// Attempt to guess the module or theme that the pdb_vue blocks are being
// created in.
const parts = process.cwd().split('/')
const possibleDrupalModule = parts[parts.length - 2]

module.exports = (packageConfig) => {
  const pdbVue = (packageConfig.pdbVue) ? packageConfig.pdbVue : {}

  const drupalModule = (pdbVue.drupalModule) ? packageConfig.pdbVue.drupalModule : possibleDrupalModule
  const mode = (pdbVue.mode) ? packageConfig.pdbVue.mode : 'instances'
  const generate = (pdbVue.mode) ? 'block' : 'whole'

  return [
    {
      name: 'generate',
      type: 'list',
      message: 'What do you want to generate?',
      choices: [
        {
          name: 'Initial framework and first block',
          value: 'whole',
        },
        {
          name: 'New block',
          value: 'block',
        },
      ],
      default: generate,
    },
    {
      name: 'mode',
      type: 'list',
      message: 'Choose the Framework Mode type of PDB blocks to create?',
      choices: [
        {
          name: 'Mode: Individual Per-block Vue instances',
          value: 'instances',
        },
        {
          name: 'Mode: SPA single page app',
          value: 'spa',
        },
      ],
      default: mode,
    },
    {
      name: 'blockName',
      type: 'input',
      message: 'Block name (human readable)',
      default: 'Hello World',
    },
    {
      name: 'blockMachineName',
      type: 'input',
      message: 'Block machine name (snake_case)',
      default: (answers) => {
        return answers.blockName.replace(' ', '_').toLowerCase()
      },
    },
    {
      name: 'drupalModuleMachineName',
      type: 'input',
      message: 'Machine name for the Drupal module or theme these files will be created within',
      default: drupalModule,
    },
  ]
}
