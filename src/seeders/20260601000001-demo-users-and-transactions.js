'use strict';

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const CATEGORIES = ['food', 'travel', 'shopping', 'bills', 'entertainment'];
const TYPES = ['debit', 'credit'];

const TRANSACTION_TITLES = {
  food: ['Grocery Store', 'Restaurant Dinner', 'Coffee Shop', 'Fast Food', 'Food Delivery'],
  travel: ['Uber Ride', 'Flight Booking', 'Hotel Stay', 'Train Ticket', 'Gas Station'],
  shopping: ['Amazon Purchase', 'Clothing Store', 'Electronics', 'Home Depot', 'Book Store'],
  bills: ['Electricity Bill', 'Internet Bill', 'Phone Bill', 'Water Bill', 'Insurance Premium'],
  entertainment: ['Netflix Subscription', 'Movie Tickets', 'Concert Tickets', 'Gaming', 'Spotify'],
};

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(monthsBack) {
  const now = new Date();
  const start = new Date(now);
  start.setMonth(start.getMonth() - monthsBack);
  const diff = now.getTime() - start.getTime();
  return new Date(start.getTime() + Math.random() * diff);
}

function generateTransactions(userId, count) {
  const transactions = [];
  for (let i = 0; i < count; i++) {
    const category = CATEGORIES[randomBetween(0, CATEGORIES.length - 1)];
    const titles = TRANSACTION_TITLES[category];
    const type = TYPES[randomBetween(0, TYPES.length - 1)];
    const amount = type === 'credit'
      ? randomBetween(1000, 15000) + randomBetween(0, 99) / 100
      : randomBetween(50, 5000) + randomBetween(0, 99) / 100;

    transactions.push({
      id: uuidv4(),
      user_id: userId,
      title: titles[randomBetween(0, titles.length - 1)],
      category,
      amount: parseFloat(amount.toFixed(2)),
      type,
      transaction_date: randomDate(6),
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
  return transactions;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const existingUsers = await queryInterface.rawSelect('users', { where: { email: 'demo@example.com' } }, ['id']);
    if (existingUsers) {
      return;
    }

    const salt = await bcrypt.genSalt(12);

    const user1Id = uuidv4();
    const user2Id = uuidv4();

    const users = [
      {
        id: user1Id,
        name: 'Demo User',
        email: 'demo@example.com',
        password_hash: await bcrypt.hash('Demo@1234', salt),
        profile_image_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: user2Id,
        name: 'Jane Smith',
        email: 'jane@example.com',
        password_hash: await bcrypt.hash('Jane@1234', salt),
        profile_image_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert('users', users);

    const transactions = [
      ...generateTransactions(user1Id, randomBetween(40, 60)),
      ...generateTransactions(user2Id, randomBetween(40, 60)),
    ];

    await queryInterface.bulkInsert('transactions', transactions);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('transactions', null, {});
    await queryInterface.bulkDelete('users', null, {});
  },
};
