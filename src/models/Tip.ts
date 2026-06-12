import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface TipAttributes {
  id: string;
  category: string;
  icon: string;
  title: string;
  body: string;
  read_time: string;
  featured: boolean;
  created_at: Date;
  updated_at: Date;
}

type TipCreationAttributes = Optional<TipAttributes, 'id' | 'featured' | 'created_at' | 'updated_at'>;

export class Tip extends Model<TipAttributes, TipCreationAttributes> implements TipAttributes {
  declare id: string;
  declare category: string;
  declare icon: string;
  declare title: string;
  declare body: string;
  declare read_time: string;
  declare featured: boolean;
  declare created_at: Date;
  declare updated_at: Date;
}

Tip.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    category: { type: DataTypes.STRING(50), allowNull: false },
    icon: { type: DataTypes.STRING(50), allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: false },
    body: { type: DataTypes.TEXT, allowNull: false },
    read_time: { type: DataTypes.STRING(20), allowNull: false },
    featured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  },
  {
    sequelize,
    tableName: 'tips',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
