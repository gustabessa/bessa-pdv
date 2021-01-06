const Venda = require('./model');
const itemVendaController = require('../itemvenda/controller');
const { Op } = require("sequelize");
const db = require('../configs/sequelize');
const ItemVenda = require('../itemvenda/model');

exports.create = (req, res, next) => {

  this.validaVenda(req, req.body);

  const venda = {}
  venda.fk_venda_user = req.userId
  venda.subtotal = req.body.subtotal
  venda.cliente = req.body.cliente
  venda.itensVenda = req.body.itensVenda
  // venda.total = req.body.total
  // venda.desconto = req.body.desconto
  // venda.frete = req.body.frete

  Venda.create(venda, { include: [{
    association: ItemVenda.Venda
  }] })
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    next(err);
  });
}

exports.update = (req, res, next) => {

  this.validaVenda(req, req.body);

  const venda = {}
  const condicao = {
    where: {}
  }
  venda.nome = req.body.nome
  venda.preco = req.body.preco

  condicao.where.id = req.body.id

  Venda.update(venda, condicao)
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
  console.log(req.query)
  if (req.query) {
    const q = req.query
    // Data de criação
    if (q.dataInicial && q.dataFinal) {
      where.createdAt = {
        [Op.between]: [q.dataInicial, q.dataFinal]
      } 
    }
    else if (q.dataInicial) {
      where.createdAt = {
        [Op.gte]: q.dataInicial
      } 
    }
    else if (q.dataFinal) {
      where.createdAt = {
        [Op.lte]: q.dataFinal
      } 
    }

    // Preço da venda
    if (q.precoInicial && q.precoFinal && q.precoFinal > 0) {
      where.subtotal = {
        [Op.between]: [q.precoInicial, q.precoFinal]
      } 
    }
    else if (q.precoFinal && q.precoFinal > 0) {
      where.subtotal = {
        [Op.lte]: q.precoFinal
      } 
    }
    else if (q.precoInicial && q.precoInicial > 0) {
      where.subtotal = {
        [Op.gte]: q.precoInicial
      } 
    }
    
  }

  Venda.findAll({where: where, order: [['createdAt', 'DESC']], include: [{
    association: ItemVenda.Venda,
    as: 'itensVenda'
  }]})
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    next(err)
  });
}

exports.findOne = (req, res, next) => {
  const id = req.params.id;

  Venda.findOne({where: {id: id}})
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

  Venda.destroy({
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
  if (req.method !== 'POST' && !req.userId) {
    throw 'Usuário inválido!'
  }
  if (!body.itensVenda || body.itensVenda.length === 0) {
    throw 'Impossível criar venda sem itens.'
  }
}