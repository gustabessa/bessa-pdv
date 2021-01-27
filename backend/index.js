require('dotenv-safe').config();
const jwt = require('jsonwebtoken');
const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const db = require('./src/configs/sequelize')
const ROOT_PATH = __dirname
const publicPath = ['/auth', '/favicon.ico', '/login']
const publicPost = ['/user']

exports.getRootPath = () => {
  return ROOT_PATH
}

// Remover /api no prod
// app.use(tratarRequest)
app.use(cors())
app.options('*', cors())
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({extended: true})) 
app.use(verifyJWT)

// app.use(express.static('public'))

db.sequelize.sync({alter: true}).then(()=>{
  console.log('Sincronizado com sucesso!')})
  .catch(console.log)

require('./src/user/routes')(app)
require('./src/produto/routes')(app)
require('./src/venda/routes')(app)
require('./src/autenticacao/routes')(app)

function tratarRequest(req, res, next) {
  req.url = req.url.replace(/\/api/g, '')
  next()
}

function verifyJWT(req, res, next){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,accesstoken');
  if (!isPublicPath(req, req.url)) {
    const token = req.headers['accesstoken'];
    if (!token || token === 'null' || token === 'undefined') return res.status(200).send({ auth: false, hasError: true, messageError: 'Acesso negado! Faça login.', techError: 'Acesso negado.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) {
        res.setHeader('accesstoken', null)
        return res.status(200).send({ auth: false, accesstoken: null, hasError: true, messageError: 'Sessão encerrada! Por favor, faça login novamente.', techError: 'Sessão encerrada.' });
      } 
      
      // se tudo estiver ok, salva no request para uso posterior
      req.userId = decoded.id;
      next();
    });
  } else {
    next();
  }
}

function isPublicPath (req, path) {
  if (publicPath.indexOf(path) >= 0) {
    return true;
  } else if (req.method === 'POST' && publicPost.indexOf(path) >= 0) {
    return true;
  } else return false;
}

var server = app.listen(3000, () => {
  console.log('Servidor rodando na porta ' + server.address().port + ' no host ' + server.address().address)
})