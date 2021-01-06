const db = require('../configs/sequelize');
const sequelize = db.sequelize;
const Venda = require('../venda/model');
const Produto = require('../produto/model');
const { Model, DataTypes } = db.Sequelize;

class ItemVenda extends Model {}

ItemVenda.init({
  quantidade: {
    type: DataTypes.DECIMAL(10,2)
  },
  preco: {
    type: DataTypes.DECIMAL(10,2)
  },
  precoTotal: {
    type: DataTypes.DECIMAL(10,2)
  },
  nome: {
    type: DataTypes.STRING(255)
  }
}, {sequelize, modelName: "itensvenda"})

ItemVenda.Venda = Venda.hasMany(ItemVenda, {
  as: 'itensVenda',
  foreignKey: {
    name: 'fk_itemvenda_venda',
    allowNull: false
  },
  onDelete: 'RESTRICT'
})

Venda.ItemVenda = ItemVenda.belongsTo(Venda, {
  as: 'itensVenda',
  foreignKey: {
    name: 'fk_itemvenda_venda',
    allowNull: false
  },
  onDelete: 'RESTRICT'
})

ItemVenda.Produto = Produto.hasMany(ItemVenda, {
  foreignKey: {
    name: 'fk_itemvenda_produto',
    allowNull: false
  },
  onDelete: 'RESTRICT'
})

Produto.ItemVenda = ItemVenda.belongsTo(Produto, {
  foreignKey: {
    name: 'fk_itemvenda_produto',
    allowNull: false
  },
  onDelete: 'RESTRICT'
})

module.exports = ItemVenda