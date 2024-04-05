'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CiMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  CiMessage.init({
    deviceId: DataTypes.INTEGER,
    meterNumber: DataTypes.STRING,
    forwardFlow: DataTypes.DOUBLE,
    reverseFlow: DataTypes.DOUBLE,
    unit: DataTypes.STRING,
    meterTime: DataTypes.DATE,
    statusByte: DataTypes.STRING,
    batteryVoltage: DataTypes.DOUBLE,
    checkCode: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CiMessage',
  });
  return CiMessage;
};