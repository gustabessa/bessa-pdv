import axios from 'axios'

const AUTH_TOKEN = 'tokenApi'
const REMEMBER_PARAM = 'accesstoken'

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  const authToken = window.localStorage.getItem(AUTH_TOKEN)
  if (authToken) {
    config.headers[REMEMBER_PARAM] = authToken
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Guarda o token de authenticação toda vez que ele vem em um response
  const token = response.headers[REMEMBER_PARAM]
  if (token) {
    window.localStorage.setItem('tokenApi', token)
  }

  return response
}, function (error) {
  return Promise.reject(error)
})

export default {
  doGet (url, sucesso, falha, data) {
    axios.get(url, { params: data })
      .then(data => {
        this.tratarResposta(data, sucesso, falha)
      })
      .catch(err => {
        console.log(err)
        falha('Erro no servidor! Atualize a página e tente novamente!')
      })
  },

  doPost (url, data, sucesso, falha) {
    axios.post(url, data)
      .then(data => {
        this.tratarResposta(data, sucesso, falha)
      })
      .catch(err => {
        console.log(err)
        falha('Erro no servidor! Atualize a página e tente novamente!')
      })
  },

  doPut (url, data, sucesso, falha) {
    axios.put(url, data)
      .then(data => {
        this.tratarResposta(data, sucesso, falha)
      })
      .catch(err => {
        console.log(err)
        falha('Erro no servidor! Atualize a página e tente novamente!')
      })
  },

  doDelete (url, data, sucesso, falha) {
    axios.delete(url, { data: data })
      .then(data => {
        this.tratarResposta(data, sucesso, falha)
      })
      .catch(err => {
        console.log(err)
        falha('Erro no servidor! Atualize a página e tente novamente!')
      })
  },

  tratarResposta (data, sucesso, falha) {
    data = data.data
    if (!data.hasError) {
      if (data.result == null) {
        sucesso(data)
      } else {
        sucesso(data.result)
      }
    } else {
      falha(data.messageError)
    }
  }
}
