const ItemVenda = require('./model');
const { Op } = require("sequelize");
const db = require('../configs/sequelize');

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
    if (data) {
      res.send(data)
    } else {
      next({messageError: 'Nenhum item da venda encotrado.', techError: 'Nada encontrado.'})
    }
  })
  .catch(err => {
    const errorResponse = {
      messageError: 'Erro ao buscar todos os itens da venda.',
      techError: err.toString()
    }
    next(errorResponse)
  });
}

exports.findOne = (req, res, next) => {
  const id = req.params.id;

  ItemVenda.findOne({where: {id: id}})
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    const errorResponse = {
      messageError: 'Erro ao buscar item da venda.',
      techError: err.toString()
    }
    next(errorResponse)
  });
}

exports.destroy = (req, res, next) => {

  if (!req.body.id) {
    next({messageError: 'Id deve ser diferente de nulo na exclusão.', techError: 'null id'})
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
    const errorResponse = {
      messageError: 'Erro ao excluir item da venda.',
      techError: err.toString()
    }
    next(errorResponse)
  });
}