'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LtMessages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      deviceId: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING
      },
      ver: {
        type: Sequelize.INTEGER
      },
      vol: {
        type: Sequelize.DOUBLE
      },
      rssi: {
        type: Sequelize.INTEGER
      },
      snr: {
        type: Sequelize.DOUBLE
      },
      gpsstate: {
        type: Sequelize.STRING
      },
      vibstate: {
        type: Sequelize.STRING
      },
      chgstate: {
        type: Sequelize.STRING
      },
      crc: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('LtMessages');
  }
};