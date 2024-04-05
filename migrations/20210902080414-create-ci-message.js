'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CiMessages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      deviceId: {
        type: Sequelize.INTEGER
      },
      meterNumber: {
        type: Sequelize.STRING
      },
      forwardFlow: {
        type: Sequelize.DOUBLE
      },
      reverseFlow: {
        type: Sequelize.DOUBLE
      },
      unit: {
        type: Sequelize.STRING
      },
      meterTime: {
        type: Sequelize.DATE
      },
      statusByte: {
        type: Sequelize.STRING
      },
      batteryVoltage: {
        type: Sequelize.DOUBLE
      },
      checkCode: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('CiMessages');
  }
};