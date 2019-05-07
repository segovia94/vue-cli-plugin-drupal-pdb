module.exports = [
  {
    name: 'generate',
    type: 'list',
    message: 'What do you want to generate?',
    choices: [
      {
        name: 'Initial framework and first block',
        value: 'whole'
      },
      {
        name: 'New block',
        value: 'block'
      }
    ],
    default: 'whole'
  },
  {
    name: `singleInstance`,
    type: 'confirm',
    message: 'Is this a single Vue instance block?',
    default: true
  },
  {
    name: `blockName`,
    type: 'input',
    message: 'Block name (human readable)',
    default: 'Hello World'
  },
  {
    name: `blockMachineName`,
    type: 'input',
    message: 'Block machine name (snake_case)',
    default: 'hello_world'
  },
  {
    name: `drupalModuleMachineName`,
    type: 'input',
    message: 'Machine name for the Drupal module or theme these files will be created within',
  }
]