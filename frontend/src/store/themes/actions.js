/*
export function someAction (context) {
}
*/
export function Default (context) {
  context.commit('SET_THEME', { name: 'default' })
}

export function Theme2 (context) {
  context.commit('SET_THEME', { name: 'theme2' })
}

export function Theme3 (context) {
  context.commit('SET_THEME', { name: 'theme3' })
}

export function Theme4 (context) {
  context.commit('SET_THEME', { name: 'theme4' })
}
