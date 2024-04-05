'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SwmMessages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      deviceId: {
        type: Sequelize.INTEGER
      },
      alarm: {
        type: Sequelize.BOOLEAN
      },
      alarmReboot: {
        type: Sequelize.BOOLEAN
      },
      alarmBatteryLow: {
        type: Sequelize.BOOLEAN
      },
      alarmNoRepayment: {
        type: Sequelize.BOOLEAN
      },
      alarmSteal: {
        type: Sequelize.BOOLEAN
      },
      alarmValveClosed: {
        type: Sequelize.BOOLEAN
      },
      alarmNoSignal: {
        type: Sequelize.BOOLEAN
      },
      alarmValveFault: {
        type: Sequelize.BOOLEAN
      },
      batteryStatus: {
        type: Sequelize.DOUBLE
      },
      valveStatus: {
        type: Sequelize.BOOLEAN
      },
      pulseUnit: {
        type: Sequelize.DOUBLE
      },
      meterReading: {
        type: Sequelize.DOUBLE
      },
      meterTime: {
        type: Sequelize.DATE
      },
      battery: {
        type: Sequelize.DOUBLE
      },
      deviceType: {
        type: Sequelize.STRING
      },
      softwareVersion: {
        type: Sequelize.STRING
      },
      rssi: {
        type: Sequelize.DOUBLE
      },
      snr: {
        type: Sequelize.DOUBLE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SwmMessages');
  }
};