import { User } from './User';
import { Transaction } from './Transaction';

User.hasMany(Transaction, { foreignKey: 'user_id', as: 'transactions' });
Transaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export { User, Transaction };
