<template>
  <div id="q-app">
    <router-view :key="key" />
  </div>
</template>
<script>
export default {
  name: 'App',
  computed: {
    key () { return this.$store.state.themes.name }
  }
}
</script>
