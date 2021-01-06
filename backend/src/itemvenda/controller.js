const ItemVenda = require('./model');
const { Op } = require("sequelize");
const db = require('../configs/sequelize');

exports.create = (req, res, next) => {

  this.validaVenda(req, req.body);

  const itemVenda = {}
  itemVenda.fk_venda_user = req.userId
  itemVenda.total = req.body.total
  itemVenda.subtotal = req.body.subtotal
  itemVenda.desconto = req.body.desconto
  itemVenda.frete = req.body.frete
  itemVenda.cliente = req.body.cliente

  ItemVenda.create(itemVenda)
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    next(err);
  });
}

exports.update = (req, res, next) => {

  this.validaVenda(req, req.body);

  const itemVenda = {}
  const condicao = {
    where: {}
  }
  itemVenda.nome = req.body.nome
  itemVenda.preco = req.body.preco

  condicao.where.id = req.body.id

  ItemVenda.update(itemVenda, condicao)
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    next(err);
  });
}

exports.findAll = (req, res, next) => {

  let where = {}
  where.fk_venda_user = req.userId
  if (req.query) {
    const q = req.query
    if (q.nome) {
      where.nome = {
        [Op.iLike]: '%' + q.nome + '%'
      } 
    }
  }

  ItemVenda.findAll({where: where})
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    next(err)
  });
}

exports.findOne = (req, res, next) => {
  const id = req.params.id;

  ItemVenda.findOne({where: {id: id}})
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

  ItemVenda.destroy({
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

exports.validaVenda = (req, body) => {
  if (req.method !== 'POST' && !body.id) {
    throw 'ItemVenda inválido!'
  }
  if (req.method !== 'POST' && !req.userId) {
    throw 'Usuário inválido!'
  }
}