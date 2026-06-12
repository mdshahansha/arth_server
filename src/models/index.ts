import { User } from './User';
import { Transaction } from './Transaction';
import { Wallet } from './Wallet';
import { Tip } from './Tip';
import { SavedTip } from './SavedTip';

User.hasMany(Transaction, { foreignKey: 'user_id', as: 'transactions' });
Transaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Wallet, { foreignKey: 'user_id', as: 'wallets' });
Wallet.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.belongsToMany(Tip, { through: SavedTip, foreignKey: 'user_id', otherKey: 'tip_id', as: 'savedTips' });
Tip.belongsToMany(User, { through: SavedTip, foreignKey: 'tip_id', otherKey: 'user_id', as: 'savedBy' });

export { User, Transaction, Wallet, Tip, SavedTip };
