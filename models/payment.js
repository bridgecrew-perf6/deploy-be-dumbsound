'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
        payment.belongsTo(models.user, {
            as: "user",
            foreignKey: {
                name: "userId"
            }
        })
    }
  }
  payment.init({
    startDate: DataTypes.DATE,
    dueDate: DataTypes.DATE,
    userId: DataTypes.INTEGER,
    attache: DataTypes.STRING,
    accountNumber:DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'payment',
  });
  return payment;
};