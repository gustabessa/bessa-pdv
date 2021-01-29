/*
export function someMutation (state) {
}
*/

export const setItensVenda = (state, itensVenda) => {
  state.itensVenda = itensVenda
}

export const setCliente = (state, cliente) => {
  state.cliente = cliente
}

export const setDesconto = (state, desconto) => {
  state.desconto = desconto
}

export const setFrete = (state, frete) => {
  state.frete = frete
}

export const setQtdeFrete = (state, qtdeFrete) => {
  state.qtdeFrete = qtdeFrete
}
