import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export type WalletType = 'bank' | 'cash' | 'credit' | 'savings';

interface WalletAttributes {
  id: string;
  user_id: string;
  name: string;
  type: WalletType;
  account_number: string;
  balance: number;
  color: string;
  created_at: Date;
  updated_at: Date;
}

type WalletCreationAttributes = Optional<WalletAttributes, 'id' | 'created_at' | 'updated_at'>;

export class Wallet extends Model<WalletAttributes, WalletCreationAttributes> implements WalletAttributes {
  declare id: string;
  declare user_id: string;
  declare name: string;
  declare type: WalletType;
  declare account_number: string;
  declare balance: number;
  declare color: string;
  declare created_at: Date;
  declare updated_at: Date;
}

Wallet.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    name: { type: DataTypes.STRING(100), allowNull: false },
    type: { type: DataTypes.ENUM('bank', 'cash', 'credit', 'savings'), allowNull: false },
    account_number: { type: DataTypes.STRING(50), allowNull: false },
    balance: { type: DataTypes.DECIMAL(14, 2), allowNull: false, defaultValue: 0 },
    color: { type: DataTypes.STRING(10), allowNull: false, defaultValue: '#167AFF' },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  },
  {
    sequelize,
    tableName: 'wallets',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
