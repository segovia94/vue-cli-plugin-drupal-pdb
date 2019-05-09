<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>Documentation on <a href="https://www.drupal.org/docs/8/modules/decoupled-blocks-vuejs/vue-components">PDB Vue components</a></p>
  </div>
</template>

<script>
export default {
  name: '<%= blockComponentName %>',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  color: #42b983;
}
</style>
