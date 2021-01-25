const User = require('./model');
const db = require('../configs/sequelize');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.create = (req, res, next) => {

  if (!this.validaUser(req.body, next)) {
    return
  }

  const hashPass = bcrypt.hashSync(req.body.senha, saltRounds, (err, hash) => {
    if (err) {
       next({messageError: 'Erro ao encriptar senha.', techError: err.toString()});
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
    let msg
    errString = err.toString()
    if (errString.split(':')[0] === 'SequelizeUniqueConstraintError') {
      msg = 'Usuário já está em uso.'
    } else {
      msg = 'Erro ao criar usuário.'
    }
    const errorResponse = {
      messageError: msg,
      techError: errString
    }
    next(errorResponse)
  });
}

exports.findAll = (req, res, next) => {
  User.findAll()
  .then(data => {
    if (data) {
      res.send(data)
    } else {
      next({messageError: 'Nenhum usuário encontrado.', techError: 'Nada encontrado.'})
    }
  })
  .catch(err => {
    const errorResponse = {
      messageError: 'Erro ao buscar todos os usuários.',
      techError: err.toString()
    }
    next(errorResponse)
  });
}

exports.findOne = (req, res, next) => {
  const id = req.params.id;

  User.findOne({where: {id: id}})
  .then(data => {
    if (data) {
      res.send(data)
    } else {
      next({messageError: 'Usuário não encontrado.', techError: 'Nada encontrado.'})
    }
  })
  .catch(err => {
    const errorResponse = {
      messageError: 'Erro ao buscar usuário.',
      techError: err.toString()
    }
    next(errorResponse)
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
    const errorResponse = {
      messageError: 'Erro ao excluir usuário.',
      techError: err.toString()
    }
    next(errorResponse)
  });
}

exports.validaUser = (body, next) => {
  if (!body.usuario) {
    next({messageError: 'Usuário inválido!', techError: 'Erro de validação do formulário.'}) 
    return false
  }
  if (!body.senha) {
    next({messageError: 'Senha inválida!', techError: 'Erro de validação do formulário.'}) 
    return false
  }
  if (!body.nomeEmpresa) {
    next({messageError: 'Nome da Empresa inválido!', techError: 'Erro de validação do formulário.'}) 
    return false
  }
  return true
}