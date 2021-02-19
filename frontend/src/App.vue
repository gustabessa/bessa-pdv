<template>
  <div id="q-app">
    <router-view :key="key" />
  </div>
</template>
<script>
import { colors } from 'quasar'
import scss from './css/quasar.variables.json'
export default {
  name: 'App',
  computed: {
    key () { return this.$store.state.themes.name }
  },
  mounted () {
    const cor = this.$store.state.themes.name
    colors.setBrand('primary', scss[cor])
  }
}
</script>
