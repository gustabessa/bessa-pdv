export default {
  getTheme (store) {
    return store.state.themes.name
  },
  getThemeInverse (store) {
    return store.state.themes.name + '-inverse'
  }
}
