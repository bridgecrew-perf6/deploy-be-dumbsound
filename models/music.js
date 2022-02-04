'use strict';
const {
  Model
} = require('sequelize');
const artis = require('./artis');
module.exports = (sequelize, DataTypes) => {
  class music extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

        music.belongsTo(models.artis, {
            as: "artis",
            foreignKey: {
                name: "artisId"
            }
        })
    }
  }
  music.init({
    title: DataTypes.STRING,
    year: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    atthace: DataTypes.STRING,
    artisId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'music',
  });
  return music;
};