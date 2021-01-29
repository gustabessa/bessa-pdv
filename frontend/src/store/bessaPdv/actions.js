/*
export function someAction (context) {
}
*/

export function itensVenda (context, itensVenda) {
  context.commit('setItensVenda', itensVenda)
}

export function cliente (context, cliente) {
  context.commit('setCliente', cliente)
}

export function desconto (context, desconto) {
  context.commit('setDesconto', desconto)
}

export function frete (context, frete) {
  context.commit('setFrete', frete)
}

export function qtdeFrete (context, qtdeFrete) {
  context.commit('setQtdeFrete', qtdeFrete)
}

export function valoresVenda (context, valoresVenda) {
  context.commit('setFrete', valoresVenda.vlrFrete)
  context.commit('setQtdeFrete', valoresVenda.numFrete)
  context.commit('setDesconto', valoresVenda.vlrDesconto)
}

export function limparVenda (context) {
  context.commit('setItensVenda', [])
  context.commit('setCliente', null)
  context.commit('setDesconto', '0')
  context.commit('setFrete', '0')
  context.commit('setQtdeFrete', 0)
}
