'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('wallets', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      user_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      name: { type: Sequelize.STRING(100), allowNull: false },
      type: { type: Sequelize.ENUM('bank', 'cash', 'credit', 'savings'), allowNull: false },
      account_number: { type: Sequelize.STRING(50), allowNull: false },
      balance: { type: Sequelize.DECIMAL(14, 2), allowNull: false, defaultValue: 0 },
      color: { type: Sequelize.STRING(10), allowNull: false, defaultValue: '#167AFF' },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addIndex('wallets', ['user_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('wallets');
  },
};
