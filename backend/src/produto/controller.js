const Produto = require('./model');
const { Op } = require("sequelize");
const db = require('../configs/sequelize');

exports.create = (req, res, next) => {

  if (!this.validaProduto(req, req.body, next)) {
    return
  }

  const produto = {}
  produto.fk_produto_user = req.userId
  produto.nome = req.body.nome
  produto.preco = req.body.preco
  produto.precoCusto = req.body.precoCusto

  Produto.create(produto)
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    const errorResponse = {
      messageError: 'Erro ao criar produto.',
      techError: err.toString()
    }
    next(errorResponse)
  });
}

exports.update = (req, res, next) => {

  if (!this.validaProduto(req, req.body, next)) {
    return
  }

  const produto = {}
  const condicao = {
    where: {}
  }
  produto.nome = req.body.nome
  produto.preco = req.body.preco
  produto.precoCusto = req.body.precoCusto

  condicao.where.id = req.body.id

  Produto.update(produto, condicao)
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    const errorResponse = {
      messageError: 'Erro ao atualizar produto.',
      techError: err.toString()
    }
    next(errorResponse)
  });
}

exports.findAll = (req, res, next) => {

  let where = {}
  where.fk_produto_user = req.userId
  if (req.query) {
    const q = req.query
    if (q.nome) {
      const palavras = q.nome.trim().split(' ')
      q.nome = ''
      palavras.forEach(palavra => {
        if (palavra !== '') {
          q.nome += '%' + palavra.trim() + '% '
        }
      }); 
      q.nome = q.nome.trim()
      where.nome = {
        [Op.iLike]: q.nome
      } 
    }
  }

  Produto.findAll({where: where, order: [['nome', 'ASC']]})
  .then(data => {
    if (data) {
      res.send(data)
    } else {
      next({messageError: 'Nenhum produto encontrado!', techError: 'Nada encontrado.'})
    }
  })
  .catch(err => {
    const errorResponse = {
      messageError: 'Erro ao buscar todos os produtos.',
      techError: err.toString()
    }
    next(errorResponse)
  });
}

exports.findOne = (req, res, next) => {
  const id = req.params.id;

  Produto.findOne({where: {id: id}})
  .then(data => {
    if (data) {
      res.send(data)
    } else {
      next({messageError: 'Produto não encontrado.', techError: 'Nada encontrado.'})
    }
  })
  .catch(err => {
    const errorResponse = {
      messageError: 'Erro ao buscar produto.',
      techError: err.toString()
    }
    next(errorResponse)
  });
}

exports.destroy = (req, res, next) => {

  if (!req.body.id) {
    next({messageError: 'Id deve ser diferente de nulo na exclusão.', techError: 'null id'})
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
    const errorResponse = {
      messageError: 'Erro ao excluir produto.',
      techError: err.toString()
    }
    next(errorResponse)
  });
}

exports.validaProduto = (req, body, next) => {
  if (req.method !== 'POST' && !body.id) {
    next({messageError: 'Produto inválido!', techError: 'Erro no preenchimento do formulário.'})
    return false
  }
  if (req.method !== 'POST' && !req.userId) {
    next({messageError: 'Usuário inválido!', techError: 'Erro no preenchimento do formulário.'})
    return false
  }
  if (!body.nome) {
    next({messageError: 'Nome inválido!', techError: 'Erro no preenchimento do formulário.'})
    return false
  }
  if (!body.preco) {
    next({messageError: 'Preço inválido!', techError: 'Erro no preenchimento do formulário.'})
    return false
  }
  return true
}