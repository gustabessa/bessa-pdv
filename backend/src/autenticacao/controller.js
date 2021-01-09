require('dotenv-safe').config();
const jwt = require('jsonwebtoken');
const User = require('./../user/model');
const db = require('../configs/sequelize');
const bcrypt = require('bcrypt');

exports.check = (req, res) => {
  res.sendStatus(200);
}

exports.login = async (req, res, next) => {

  const usuario = req.body.usuario;
  const senha = req.body.senha;

  let user;
  User.findOne({where: {usuario: usuario}})
  .then(data => {
    user = data;
    if (!user) {
      next({messageError: 'Usuário ou senha incorreta.', techError: 'Erro de autenticação.'})
    }
    const senhaCorreta = bcrypt.compareSync(senha, user.senha);
    if (senhaCorreta) {
      let token = jwt.sign({ id: user.id }, process.env.SECRET, {
        expiresIn: 3000 // expires in 50min
      });
      res.setHeader('accesstoken', token)
      res.sendStatus(200);
    } else {
      next({messageError: 'Usuário ou senha incorreta.', techError: 'Erro de autenticação.'})
    }
  }).catch(err => {
    const errorResponse = {
      messageError: 'Erro ao autenticar usuário.',
      techError: err.toString()
    }
    next(errorResponse)
  });
}

exports.logout = (req, res) => {
  res.setHeader('accesstoken', null)
  res.status(200).send({ auth: false, accesstoken: null });
}