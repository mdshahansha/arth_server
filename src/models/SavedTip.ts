import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface SavedTipAttributes {
  id: string;
  user_id: string;
  tip_id: string;
  created_at: Date;
  updated_at: Date;
}

type SavedTipCreationAttributes = Optional<SavedTipAttributes, 'id' | 'created_at' | 'updated_at'>;

export class SavedTip extends Model<SavedTipAttributes, SavedTipCreationAttributes> implements SavedTipAttributes {
  declare id: string;
  declare user_id: string;
  declare tip_id: string;
  declare created_at: Date;
  declare updated_at: Date;
}

SavedTip.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    tip_id: { type: DataTypes.UUID, allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  },
  {
    sequelize,
    tableName: 'saved_tips',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
