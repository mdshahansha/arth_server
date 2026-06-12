'use strict';

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

/* ─── Categories & Titles ─── */
const TRANSACTION_TITLES = {
  food: [
    'Grocery Store', 'Restaurant Dinner', 'Coffee Shop', 'Fast Food', 'Food Delivery',
    'Pizza Hut', 'Starbucks', 'Swiggy Order', 'Zomato Order', 'Bakery Purchase',
    'Fruit Vendor', 'Ice Cream Parlour', 'Juice Bar', 'Street Food', 'Lunch Buffet',
  ],
  travel: [
    'Uber Ride', 'Flight Booking', 'Hotel Stay', 'Train Ticket', 'Gas Station',
    'Ola Cab', 'Metro Card Recharge', 'Parking Fee', 'Toll Charges', 'Bus Ticket',
    'Airport Transfer', 'Car Rental', 'Bike Rental', 'Highway Fuel', 'Rapido Ride',
  ],
  shopping: [
    'Amazon Purchase', 'Clothing Store', 'Electronics', 'Home Depot', 'Book Store',
    'Flipkart Order', 'Myntra Fashion', 'IKEA Furniture', 'Nike Store', 'Apple Store',
    'Grocery Mart', 'Decathlon Sports', 'Croma Electronics', 'Reliance Digital', 'Meesho Order',
  ],
  bills: [
    'Electricity Bill', 'Internet Bill', 'Phone Bill', 'Water Bill', 'Insurance Premium',
    'House Rent', 'Gas Bill', 'DTH Recharge', 'Netflix Subscription', 'Gym Membership',
    'Hospital Visit', 'Medicine Purchase', 'Lab Test', 'Dental Checkup', 'Eye Checkup',
  ],
  entertainment: [
    'Netflix Subscription', 'Movie Tickets', 'Concert Tickets', 'Gaming Purchase', 'Spotify Premium',
    'YouTube Premium', 'BookMyShow', 'Theme Park', 'Bowling Night', 'Museum Visit',
    'Art Gallery', 'Comedy Show', 'Cricket Match', 'Football Match', 'Amusement Park',
  ],
};

const CATEGORIES = Object.keys(TRANSACTION_TITLES);

/* ─── 10 Demo Users ─── */
const DEMO_USERS = [
  {
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'Demo@1234',
    seed: 'demo',
    txnCount: [55, 70],
    spendProfile: 'balanced',
  },
  {
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    password: 'Rahul@1234',
    seed: 'rahul',
    txnCount: [45, 60],
    spendProfile: 'foodie',
  },
  {
    name: 'Priya Patel',
    email: 'priya@example.com',
    password: 'Priya@1234',
    seed: 'priya',
    txnCount: [50, 65],
    spendProfile: 'shopper',
  },
  {
    name: 'Amit Kumar',
    email: 'amit@example.com',
    password: 'Amit@1234',
    seed: 'amit',
    txnCount: [40, 55],
    spendProfile: 'traveler',
  },
  {
    name: 'Sneha Gupta',
    email: 'sneha@example.com',
    password: 'Sneha@1234',
    seed: 'sneha',
    txnCount: [60, 75],
    spendProfile: 'entertainment',
  },
  {
    name: 'Vikram Singh',
    email: 'vikram@example.com',
    password: 'Vikram@1234',
    seed: 'vikram',
    txnCount: [35, 50],
    spendProfile: 'saver',
  },
  {
    name: 'Ananya Reddy',
    email: 'ananya@example.com',
    password: 'Ananya@1234',
    seed: 'ananya',
    txnCount: [50, 65],
    spendProfile: 'bills_heavy',
  },
  {
    name: 'Rohan Mehta',
    email: 'rohan@example.com',
    password: 'Rohan@1234',
    seed: 'rohan',
    txnCount: [45, 60],
    spendProfile: 'high_earner',
  },
  {
    name: 'Kavita Joshi',
    email: 'kavita@example.com',
    password: 'Kavita@1234',
    seed: 'kavita',
    txnCount: [55, 70],
    spendProfile: 'balanced',
  },
  {
    name: 'Arjun Nair',
    email: 'arjun@example.com',
    password: 'Arjun@1234',
    seed: 'arjun',
    txnCount: [40, 55],
    spendProfile: 'student',
  },
];

/* ─── Spend profiles control category weight & amount ranges ─── */
const SPEND_PROFILES = {
  balanced: {
    weights: { food: 20, travel: 20, shopping: 20, bills: 20, entertainment: 20 },
    debitRange: [100, 8000],
    creditRange: [5000, 25000],
    creditRatio: 0.25,
  },
  foodie: {
    weights: { food: 40, travel: 10, shopping: 15, bills: 20, entertainment: 15 },
    debitRange: [150, 6000],
    creditRange: [8000, 20000],
    creditRatio: 0.2,
  },
  shopper: {
    weights: { food: 15, travel: 10, shopping: 40, bills: 20, entertainment: 15 },
    debitRange: [200, 15000],
    creditRange: [10000, 30000],
    creditRatio: 0.2,
  },
  traveler: {
    weights: { food: 15, travel: 40, shopping: 10, bills: 20, entertainment: 15 },
    debitRange: [300, 20000],
    creditRange: [15000, 40000],
    creditRatio: 0.22,
  },
  entertainment: {
    weights: { food: 15, travel: 15, shopping: 15, bills: 15, entertainment: 40 },
    debitRange: [100, 5000],
    creditRange: [8000, 18000],
    creditRatio: 0.2,
  },
  saver: {
    weights: { food: 25, travel: 5, shopping: 10, bills: 30, entertainment: 10 },
    debitRange: [50, 3000],
    creditRange: [15000, 35000],
    creditRatio: 0.35,
  },
  bills_heavy: {
    weights: { food: 15, travel: 10, shopping: 10, bills: 45, entertainment: 10 },
    debitRange: [200, 12000],
    creditRange: [10000, 25000],
    creditRatio: 0.22,
  },
  high_earner: {
    weights: { food: 18, travel: 22, shopping: 22, bills: 18, entertainment: 20 },
    debitRange: [500, 25000],
    creditRange: [30000, 80000],
    creditRatio: 0.3,
  },
  student: {
    weights: { food: 30, travel: 15, shopping: 15, bills: 15, entertainment: 25 },
    debitRange: [30, 2000],
    creditRange: [3000, 10000],
    creditRatio: 0.18,
  },
};

/* ─── Helpers ─── */
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

function randomDate(monthsBack) {
  const now = new Date();
  const start = new Date(now);
  start.setMonth(start.getMonth() - monthsBack);
  const diff = now.getTime() - start.getTime();
  return new Date(start.getTime() + Math.random() * diff);
}

function weightedRandomCategory(weights) {
  const entries = Object.entries(weights);
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let rand = Math.random() * total;
  for (const [cat, w] of entries) {
    rand -= w;
    if (rand <= 0) return cat;
  }
  return entries[entries.length - 1][0];
}

function generateTransactions(userId, count, profile) {
  const cfg = SPEND_PROFILES[profile];
  const transactions = [];

  for (let i = 0; i < count; i++) {
    const isCredit = Math.random() < cfg.creditRatio;
    const type = isCredit ? 'credit' : 'debit';
    const category = weightedRandomCategory(cfg.weights);
    const titles = TRANSACTION_TITLES[category];
    const title = titles[randomBetween(0, titles.length - 1)];

    const amount = isCredit
      ? randomFloat(cfg.creditRange[0], cfg.creditRange[1])
      : randomFloat(cfg.debitRange[0], cfg.debitRange[1]);

    const txnDate = randomDate(6);

    transactions.push({
      id: uuidv4(),
      user_id: userId,
      title,
      category,
      amount,
      type,
      transaction_date: txnDate,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  return transactions;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    /* Idempotent: skip if first demo user already exists */
    const existingUsers = await queryInterface.rawSelect(
      'users',
      { where: { email: 'demo@example.com' } },
      ['id'],
    );
    if (existingUsers) {
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const users = [];
    const allTransactions = [];

    for (const u of DEMO_USERS) {
      const userId = uuidv4();
      const txnCount = randomBetween(u.txnCount[0], u.txnCount[1]);

      users.push({
        id: userId,
        name: u.name,
        email: u.email,
        password_hash: await bcrypt.hash(u.password, salt),
        profile_image_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.seed}`,
        created_at: new Date(),
        updated_at: new Date(),
      });

      allTransactions.push(...generateTransactions(userId, txnCount, u.spendProfile));
    }

    await queryInterface.bulkInsert('users', users);

    /* Insert transactions in batches of 100 to avoid packet-size issues */
    const BATCH = 100;
    for (let i = 0; i < allTransactions.length; i += BATCH) {
      await queryInterface.bulkInsert(
        'transactions',
        allTransactions.slice(i, i + BATCH),
      );
    }

    console.log(`\n  Seeded ${users.length} users and ${allTransactions.length} transactions.\n`);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('transactions', null, {});
    await queryInterface.bulkDelete('users', null, {});
  },
};
