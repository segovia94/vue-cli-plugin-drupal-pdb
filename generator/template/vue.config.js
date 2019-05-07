const {singleInstances} = require('vue-cli-plugin-drupal-pdb');

module.exports = {
  filenameHashing: false,
  pages: singleInstances(),
}
