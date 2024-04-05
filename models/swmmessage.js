'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SwmMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  SwmMessage.init({
    deviceId: DataTypes.INTEGER,
    alarm: DataTypes.BOOLEAN,
    alarmReboot: DataTypes.BOOLEAN,
    alarmBatteryLow: DataTypes.BOOLEAN,
    alarmNoRepayment: DataTypes.BOOLEAN,
    alarmSteal: DataTypes.BOOLEAN,
    alarmValveClosed: DataTypes.BOOLEAN,
    alarmNoSignal: DataTypes.BOOLEAN,
    alarmValveFault: DataTypes.BOOLEAN,
    batteryStatus: DataTypes.DOUBLE,
    valveStatus: DataTypes.BOOLEAN,
    pulseUnit: DataTypes.DOUBLE,
    meterReading: DataTypes.DOUBLE,
    meterTime: DataTypes.DATE,
    battery: DataTypes.DOUBLE,
    deviceType: DataTypes.STRING,
    softwareVersion: DataTypes.STRING,
    rssi: DataTypes.DOUBLE,
    snr: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'SwmMessage',
  });
  return SwmMessage;
};