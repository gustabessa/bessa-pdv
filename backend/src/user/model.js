const db = require('../configs/sequelize');
const sequelize = db.sequelize;
const { Model, DataTypes } = db.Sequelize;

class User extends Model {}

User.init({
  usuario: {
    allowNull: false,
    type: DataTypes.STRING(100)
  }, 
  senha: {
    allowNull: false,
    type: DataTypes.STRING(255)
  }, 
  nomeEmpresa: {
    allowNull: false,
    type: DataTypes.STRING(100)
  }, 
  email: {
    allowNull: true,
    type: DataTypes.STRING(100)
  }, 
}, {sequelize, modelName: "users"})

module.exports = User