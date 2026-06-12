'use strict';

const { v4: uuidv4 } = require('uuid');

const TIPS = [
  { category: 'Saving', icon: 'savings', title: 'The 50/30/20 Rule: A Simple Budget Framework', body: 'Allocate 50% of income to needs, 30% to wants, and 20% to savings. This time-tested framework helps beginners build a sustainable budget.', read_time: '5 min', featured: true },
  { category: 'Budgeting', icon: 'pie', title: 'Track Every Rupee for 30 Days', body: 'Before optimizing, know where your money goes. A 30-day tracking challenge reveals hidden spending patterns.', read_time: '3 min', featured: false },
  { category: 'Investing', icon: 'graph', title: 'Start SIPs with Just ₹500/Month', body: 'Systematic investment plans let you build wealth gradually. Even small amounts compound significantly over time.', read_time: '4 min', featured: false },
  { category: 'Spending', icon: 'shopping', title: 'The 24-Hour Rule for Impulse Buys', body: 'Wait a full day before any non-essential purchase over ₹2,000. Most impulses fade, saving you thousands each month.', read_time: '2 min', featured: false },
  { category: 'Debt', icon: 'trending', title: 'Snowball vs Avalanche: Pick Your Strategy', body: 'Pay smallest debts first for quick wins (snowball) or highest-interest first for math efficiency (avalanche).', read_time: '6 min', featured: false },
  { category: 'Saving', icon: 'wallet', title: 'Automate Your Emergency Fund', body: 'Set up an auto-transfer on payday. Aim for 3–6 months of expenses in a high-yield savings account.', read_time: '3 min', featured: false },
  { category: 'Budgeting', icon: 'pie', title: 'Zero-Based Budgeting Explained', body: 'Assign every rupee a job before the month starts. Income minus all allocations should equal zero — nothing goes untracked.', read_time: '4 min', featured: false },
  { category: 'Investing', icon: 'graph', title: 'Index Funds vs Active Funds', body: 'Index funds charge lower fees and historically outperform most actively managed funds over 10+ year horizons.', read_time: '5 min', featured: false },
  { category: 'Spending', icon: 'shopping', title: 'Subscription Audit: Find Hidden Leaks', body: 'Review every recurring charge quarterly. Most people find 2–3 subscriptions they forgot about, saving ₹500–2,000/month.', read_time: '3 min', featured: false },
  { category: 'Debt', icon: 'trending', title: 'Balance Transfer: When It Makes Sense', body: 'Moving high-interest credit card debt to a 0% introductory offer can save thousands — but watch the transfer fee and deadline.', read_time: '4 min', featured: false },
  { category: 'Saving', icon: 'savings', title: 'The Latte Factor Is Real', body: 'Small daily expenses add up fast. ₹200/day on snacks and drinks is ₹6,000/month — enough to fund an SIP.', read_time: '2 min', featured: false },
  { category: 'Investing', icon: 'graph', title: 'Power of Compounding: Start Early', body: 'Investing ₹5,000/month from age 25 beats ₹15,000/month from age 35 over a 30-year horizon thanks to compound interest.', read_time: '5 min', featured: false },
];

const WALLET_TEMPLATES = [
  { name: 'Main Account', type: 'bank', account_number: '•••• 4821', color: '#167AFF', balanceRange: [80000, 250000] },
  { name: 'Cash Wallet', type: 'cash', account_number: 'Physical', color: '#31BA96', balanceRange: [5000, 30000] },
  { name: 'Credit Card', type: 'credit', account_number: '•••• 9034', color: '#B548C6', balanceRange: [-50000, -5000] },
  { name: 'Savings', type: 'savings', account_number: 'Goal 80%', color: '#FF8701', balanceRange: [100000, 500000] },
];

function randomFloat(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const existing = await queryInterface.rawSelect('tips', { where: {}, limit: 1 }, ['id']);
    if (existing) return;

    const now = new Date();
    const tips = TIPS.map((t) => ({
      id: uuidv4(),
      ...t,
      created_at: now,
      updated_at: now,
    }));
    await queryInterface.bulkInsert('tips', tips);

    const [users] = await queryInterface.sequelize.query('SELECT id FROM users');
    const wallets = [];
    for (const user of users) {
      for (const tpl of WALLET_TEMPLATES) {
        wallets.push({
          id: uuidv4(),
          user_id: user.id,
          name: tpl.name,
          type: tpl.type,
          account_number: tpl.account_number,
          balance: randomFloat(tpl.balanceRange[0], tpl.balanceRange[1]),
          color: tpl.color,
          created_at: now,
          updated_at: now,
        });
      }
    }
    const BATCH = 100;
    for (let i = 0; i < wallets.length; i += BATCH) {
      await queryInterface.bulkInsert('wallets', wallets.slice(i, i + BATCH));
    }

    const tipIds = tips.slice(0, 3).map((t) => t.id);
    const savedTips = [];
    for (const user of users.slice(0, 5)) {
      for (const tipId of tipIds.slice(0, 2)) {
        savedTips.push({
          id: uuidv4(),
          user_id: user.id,
          tip_id: tipId,
          created_at: now,
          updated_at: now,
        });
      }
    }
    if (savedTips.length) {
      await queryInterface.bulkInsert('saved_tips', savedTips);
    }

    console.log(`\n  Seeded ${tips.length} tips, ${wallets.length} wallets, ${savedTips.length} saved tips.\n`);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('saved_tips', null, {});
    await queryInterface.bulkDelete('wallets', null, {});
    await queryInterface.bulkDelete('tips', null, {});
  },
};
