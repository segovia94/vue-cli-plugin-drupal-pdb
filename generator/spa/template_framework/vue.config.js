// Set this to the path in Drupal where your pdb_vue 'dist' directory lives.
const drupalPath = '/modules/<%= drupalModuleMachineName %>/pdb_vue/dist/'

module.exports = {
  // Disable filename hashing in Drupal.
  filenameHashing: process.env.NODE_ENV !== 'production',
  // Set the public path so images will work.
  publicPath: process.env.NODE_ENV === 'production' ? drupalPath : '/'
}
