'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SwpMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  SwpMessage.init({
    deviceId: DataTypes.INTEGER,
    waterPressure: DataTypes.DOUBLE,
    batteryVoltage: DataTypes.DOUBLE,
    boardTemperature: DataTypes.DOUBLE,
    busVoltage: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'SwpMessage',
  });
  return SwpMessage;
};