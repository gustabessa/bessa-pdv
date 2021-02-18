
const roboto = require('../util/fonts/Roboto')
const PdfPrinter = require('pdfmake');
const printer = new PdfPrinter(roboto);

const Venda = require('./model');
const moment = require('moment');
const { getRootPath } = require('../../index');
const { Op } = require("sequelize");
const db = require('../configs/sequelize');
const ItemVenda = require('../itemvenda/model');
const fs = require('fs')

exports.create = (req, res, next) => {

  if (!this.validaVenda(req, req.body, next)) {
    return
  }

  const venda = {}
  venda.fk_venda_user = req.userId
  venda.subtotal = req.body.subtotal
  venda.cliente = req.body.cliente
  venda.itensVenda = req.body.itensVenda
  venda.total = req.body.total
  venda.desconto = req.body.desconto
  venda.frete = req.body.frete
  venda.qtdeFrete = req.body.qtdeFrete

  Venda.create(venda, { include: [{
    association: ItemVenda.Venda
  }] })
  .then(data => {
    if (data) {
      this.printVenda(data).then(url => { res.send(url) })
      .catch(err => { next({messageError: 'Erro ao imprimir venda.', techError: err}) })
    } else {
      next({messageError: 'Erro ao salvar venda.', techError: 'Database error'})
    }
  })
  .catch(err => {
    const errorResponse = {
      messageError: 'Erro ao salvar venda.',
      techError: err.toString()
    }
    next(errorResponse)
  });
}

exports.update = (req, res, next) => {

  if (!this.validaVenda(req, req.body, next)) {
    return
  }

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
    const errorResponse = {
      messageError: 'Erro ao atualizar venda.',
      techError: err.toString()
    }
    next(errorResponse)
  });
}

exports.findAll = (req, res, next) => {

  let where = {}
  where.fk_venda_user = req.userId
  if (req.query) {
    const q = req.query
    // Se tem data final na query, colocar ao final do dia
    // para pegar os pedidos do dia.
    if (q.dataFinal) {
      q.dataFinal = q.dataFinal + ' 23:59:59'
    }
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
      where.total = {
        [Op.between]: [q.precoInicial, q.precoFinal]
      } 
    }
    else if (q.precoFinal && q.precoFinal > 0) {
      where.total = {
        [Op.lte]: q.precoFinal
      } 
    }
    else if (q.precoInicial && q.precoInicial > 0) {
      where.total = {
        [Op.gte]: q.precoInicial
      } 
    }
    
  }

  Venda.findAll({where: where, order: [['createdAt', 'DESC']], include: [{
    association: ItemVenda.Venda,
    as: 'itensVenda',
    order: [['item', 'ASC']]
  }]})
  .then(data => {
    if (!data) {
      next({messageError: 'Nenhuma venda encontrada.', techError: 'Nada encontrado.'})
    } else {
      res.send(data)
    }
  })
  .catch(err => {
    const errorResponse = {
      messageError: 'Erro ao buscar todas as vendas.',
      techError: err.toString()
    }
    next(errorResponse)
  });
}

exports.findOne = (req, res, next) => {
  let where = {}
  where.fk_venda_user = req.userId
  where.id = req.params.id;

  Venda.findOne({where: where, include: [{
    association: ItemVenda.Venda,
    as: 'itensVenda',
    order: [['item', 'ASC']]
  }]})
  .then(data => {
    if (!data) {
      next({messageError: 'Venda não encontrada!', techError: 'Nada encontrado.'})
    } else {
      res.send(data)
    }
  })
  .catch(err => {
    const errorResponse = {
      messageError: 'Erro ao buscar venda.',
      techError: err.toString()
    }
    next(errorResponse)
  });
}

exports.destroy = (req, res, next) => {

  if (!req.body.id) {
    next({messageError: 'Id deve ser diferente de nulo na exclusão.', techError: 'null id'})
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
    const errorResponse = {
      messageError: 'Erro ao excluir venda.',
      techError: err.toString()
    }
    next(errorResponse)
  });
}

exports.validaVenda = (req, body, next) => {
  if (req.method !== 'POST' && !req.userId) {
    next({messageError: 'Usuário inválido!', techError: 'Erro ao preencher dados da venda.'})
    return false
  }
  if (!body.itensVenda || body.itensVenda.length === 0) {
    next({messageError: 'Impossível criar venda sem itens.', techError: 'Erro ao preencher dados da venda.'})
    return false
  }
  return true
}

exports.generateReport = (req, res, next) => {
  const id = req.query.id;

  Venda.findOne({where: {id: id}, 
    include: [{
      association: ItemVenda.Venda,
      as: 'itensVenda'
  }]})
    .then(data => {
      if (data) {
        this.printVenda(data).then(url => { res.send(url) })
      .catch(err => { next({messageError: 'Erro ao imprimir venda.', techError: err}) })
      } else {
        next({messageError: 'Erro ao buscar venda para impressão.', techError: 'Erro ao buscar.'})
      }
    })
    .catch(err => {
      const errorResponse = {
        messageError: 'Erro ao buscar venda para impressão.',
        techError: err.toString()
      }
      next(errorResponse)
    });
}

exports.printVenda = (data) => {
  return new Promise((resolve, reject) => {
    const itens = data.dataValues.itensVenda
    let qtde = 0
    itens.forEach(itemVenda => {
      qtde += Number(itemVenda.quantidade)
    });
    const newArr = data.dataValues.itensVenda.map(itemVendaResp => {
      const itemVenda = itemVendaResp.dataValues
      const itemVO = [
        itemVenda.nome,
        { text: itemVenda.quantidade, alignment: 'right' },
        { text: formataDinheiro(itemVenda.preco), alignment: 'right'},
        { text: formataDinheiro(itemVenda.precoTotal), alignment: 'right' }
      ]
      return itemVO
    })

    while (newArr.length < 11) {
      newArr.push(['\n', '', '', ''])
    }

    newArr.unshift([
      { text: 'Descrição', style: 'tableHeader' }, 
      { text: 'Quantidade', style: 'tableHeaderRight' }, 
      { text: 'Preço Un. (R$)', style: 'tableHeaderRight' },
      { text: 'Preço Total (R$)', style: 'tableHeaderRight' }
    ])
    const cliente = data.dataValues.cliente ? data.dataValues.cliente : 'consumidor'
    const codVenda = data.dataValues.id
    const dataVenda = moment.parseZone(data.dataValues.createdAt).format('DD/MM/YYYY HH:mm:ss')
    const dataImpressao = moment.parseZone(new Date()).format('DD/MM/YYYY HH:mm:ss')
    const totalizadores = ('Subtotal: ' + Number(data.dataValues.subtotal).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
          + '   Frete: ' + (data.dataValues.frete ? Number(data.dataValues.frete).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') : '0,00')
          + '   Desconto: ' + (data.dataValues.desconto ? Number(data.dataValues.desconto).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') : '0,00'))
    const qtdes = itens.length + (itens.length == 1 ? ' produto' : ' produtos') + ' / ' + qtde + (qtde == 1 ? ' item' : ' itens')
    var docDefinition = {
      content: [
        { text: 'MJ BARBOSA MATERIAIS P/ CONSTRUÇÃO', fontSize: 12, alignment: 'center', margin: [0, -20, 0, 0] },
        { text: 'AV. ALOIZIO DE OLIVEIRA, 329 - ONEIDA MENDES', fontSize: 12, alignment: 'center' },
        { text: 'UBERABA/MG - CEP 38082-188 FONE/FAX: (34) 3312-0009', fontSize: 12, alignment: 'center', margin: [0, 0, 0, 10] },
        { text: 'Consumidor: ' + cliente, margin: [0, 0, 0, -15] },
        { text: 'Número Orçamento: ' + codVenda, style: 'textRight' },
        { text: 'Data do Orçamento: ' + dataVenda },
        {
          style: 'table',
          table: {
            headerRows: 1,
            widths: [235, 75, 90, 90],
            body: newArr
          },
          layout: {
            hLineWidth: function (i, node) {
              return (i === 0 || i === 1 || i === node.table.body.length) ? 2 : 0;
            },
            vLineWidth: function (i, node) {
              return 0;
            },
            hLineColor: function (i, node) {
              return 'black';
            }
          }
        },
        { text: totalizadores, margin: [0, -10, 0, 0] },
        { text: 'Data de Impressao: ' + dataImpressao + '\t\t' + qtdes, margin: [0, 0, 0, 0] },
        { text: '>> Total: ' + formataDinheiro(data.dataValues.total), alignment: 'right', margin: [0, -28, 0, 0] },
      ],
      styles: {
        textLeft: {
          alignment: 'left'
        },
        textRight: {
          alignment: 'right'
        },
        table: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black'
        },
        tableHeaderRight: {
          bold: true,
          fontSize: 12,
          color: 'black',
          alignment: 'right'
        }
      }
    };
    try {
      var pdfDoc = printer.createPdfKitDocument(docDefinition);
    } catch (error) {
      reject(error)
    }
    const reportName = 'venda' + data.dataValues.id + '.'
      + new Date().toISOString().replace(/:/g, '') + '.pdf'
    const reportPath = getRootPath() + '/reports/' + reportName
    pdfDoc.pipe(fs.createWriteStream(reportPath));
    pdfDoc.end();
    setTimeout(() => {
      resolve('http://127.0.0.1:3000/reports/' + reportName)
      setTimeout(() => {
        fs.unlink(reportPath,
          err => {
            if (err) {
              console.log(err)
              return
            }
          })
      }, 20000);
    }, 1000);
  })
}

function formataDinheiro(val) {
  return Number(val).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}