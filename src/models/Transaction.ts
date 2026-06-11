import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export type TransactionCategory = 'food' | 'travel' | 'shopping' | 'bills' | 'entertainment';
export type TransactionType = 'debit' | 'credit';

interface TransactionAttributes {
  id: string;
  user_id: string;
  title: string;
  category: TransactionCategory;
  amount: number;
  type: TransactionType;
  transaction_date: Date;
  created_at: Date;
  updated_at: Date;
}

type TransactionCreationAttributes = Optional<
  TransactionAttributes,
  'id' | 'created_at' | 'updated_at'
>;

export class Transaction
  extends Model<TransactionAttributes, TransactionCreationAttributes>
  implements TransactionAttributes
{
  declare id: string;
  declare user_id: string;
  declare title: string;
  declare category: TransactionCategory;
  declare amount: number;
  declare type: TransactionType;
  declare transaction_date: Date;
  declare created_at: Date;
  declare updated_at: Date;
}

Transaction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('food', 'travel', 'shopping', 'bills', 'entertainment'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('debit', 'credit'),
      allowNull: false,
    },
    transaction_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'transactions',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
