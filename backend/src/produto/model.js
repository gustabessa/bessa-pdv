const db = require('../configs/sequelize');
const sequelize = db.sequelize;
const User = require('../user/model');
const { Model, DataTypes } = db.Sequelize;

class Produto extends Model {}

Produto.init({
  nome: {
    allowNull: false,
    type: DataTypes.STRING(255)
  },
  preco: {
    allowNull: false,
    type: DataTypes.DECIMAL(10,2)
  },
  precoCusto: {
    type: DataTypes.DECIMAL(10,2)
  },
}, {sequelize, modelName: "produtos"})

Produto.User = User.hasMany(Produto, {
  foreignKey: {
    name: 'fk_produto_user',
    allowNull: false
  },
  onDelete: 'RESTRICT'
})

User.Produto = Produto.belongsTo(User, {
  foreignKey: {
    name: 'fk_produto_user',
    allowNull: false
  },
  onDelete: 'RESTRICT'
})

module.exports = Produto