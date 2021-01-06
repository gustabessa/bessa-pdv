const User = require('./model');
const db = require('../configs/sequelize');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.create = (req, res, next) => {

  this.validaUser(req.body);

  const hashPass = bcrypt.hashSync(req.body.senha, saltRounds, (err, hash) => {
    if (err) {
       next(err);
    } else {
      return hash;
    }
  })

  let user = {}
  user.usuario = req.body.usuario
  user.senha = hashPass
  user.nomeEmpresa = req.body.nomeEmpresa

  if (req.body.email) {
    user.email = req.body.email
  }

  User.create(user)
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    next(err)
  });
}

exports.findAll = (req, res, next) => {
  User.findAll()
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    next(err)
  });
}

exports.findOne = (req, res, next) => {
  const id = req.params.id;

  User.findOne({where: {id: id}})
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    next(err)
  });
}

exports.destroy = (req, res, next) => {
  User.destroy({
    where: {
      id: req.body.id
    }
  })
  .then(affectedRows => {
    res.send({'message': 'ok', 'affectedRows': affectedRows})
  })
  .catch(err => {
    next(err)
  });
}

exports.validaUser = (body) => {
  if (!body.usuario) {
    throw 'Usuário inválido!'
  }
  if (!body.senha) {
    throw 'Senha inválida!'
  }
  if (!body.nomeEmpresa) {
    throw 'Nome da Empresa inválido!'
  }
}