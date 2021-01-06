const Produto = require('./model');
const { Op } = require("sequelize");
const db = require('../configs/sequelize');

exports.create = (req, res, next) => {

  this.validaProduto(req, req.body);

  const produto = {}
  produto.fk_produto_user = req.userId
  produto.nome = req.body.nome
  produto.preco = req.body.preco

  Produto.create(produto)
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    next(err);
  });
}

exports.update = (req, res, next) => {

  this.validaProduto(req, req.body);

  const produto = {}
  const condicao = {
    where: {}
  }
  produto.nome = req.body.nome
  produto.preco = req.body.preco

  condicao.where.id = req.body.id

  Produto.update(produto, condicao)
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    next(err);
  });
}

exports.findAll = (req, res, next) => {

  let where = {}
  where.fk_produto_user = req.userId
  if (req.query) {
    const q = req.query
    if (q.nome) {
      where.nome = {
        [Op.iLike]: '%' + q.nome + '%'
      } 
    }
  }

  Produto.findAll({where: where})
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    next(err)
  });
}

exports.findOne = (req, res, next) => {
  const id = req.params.id;

  Produto.findOne({where: {id: id}})
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    next(err)
  });
}

exports.destroy = (req, res, next) => {

  if (!req.body.id) {
    next('Id deve ser diferente de nulo na exclusão.')
  }

  Produto.destroy({
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

exports.validaProduto = (req, body) => {
  if (req.method !== 'POST' && !body.id) {
    throw 'Produto inválido!'
  }
  if (req.method !== 'POST' && !req.userId) {
    throw 'Usuário inválido!'
  }
  if (!body.nome) {
    throw 'Nome inválido!'
  }
  if (!body.preco) {
    throw 'Preço inválido!'
  }
}