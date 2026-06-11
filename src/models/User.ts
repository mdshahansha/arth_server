import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  profile_image_url: string | null;
  created_at: Date;
  updated_at: Date;
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'created_at' | 'updated_at'>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: string;
  declare name: string;
  declare email: string;
  declare password_hash: string;
  declare profile_image_url: string | null;
  declare created_at: Date;
  declare updated_at: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      set(value: string) {
        this.setDataValue('email', value.toLowerCase().trim());
      },
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    profile_image_url: {
      type: DataTypes.STRING(2048),
      allowNull: true,
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
    tableName: 'users',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    defaultScope: {
      attributes: { exclude: ['password_hash'] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ['password_hash'] },
      },
    },
  },
);
