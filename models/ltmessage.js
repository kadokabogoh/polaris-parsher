'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LtMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  LtMessage.init({
    deviceId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    ver: DataTypes.INTEGER,
    vol: DataTypes.DOUBLE,
    rssi: DataTypes.INTEGER,
    snr: DataTypes.DOUBLE,
    gpsstate: DataTypes.STRING,
    vibstate: DataTypes.STRING,
    chgstate: DataTypes.STRING,
    crc: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'LtMessage',
  });
  return LtMessage;
};