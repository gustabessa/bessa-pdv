const db = require('../configs/sequelize');
const sequelize = db.sequelize;
const User = require('../user/model');
const { Model, DataTypes } = db.Sequelize;

class Venda extends Model {}

Venda.init({
  total: {
    type: DataTypes.DECIMAL(10,2)
  },
  subtotal: {
    type: DataTypes.DECIMAL(10,2)
  },
  desconto: {
    type: DataTypes.DECIMAL(10,2)
  },
  frete: {
    type: DataTypes.DECIMAL(10,2)
  },
  cliente: {
    type: DataTypes.STRING(255)
  }
}, {sequelize, modelName: "vendas"})

Venda.User = User.hasMany(Venda, {
  foreignKey: {
    name: 'fk_venda_user',
    allowNull: false
  },
  onDelete: 'RESTRICT'
})

User.Venda = Venda.belongsTo(User, {
  foreignKey: {
    name: 'fk_venda_user',
    allowNull: false
  },
  onDelete: 'RESTRICT'
})

module.exports = Venda