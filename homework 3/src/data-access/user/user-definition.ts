import { DataTypes } from 'sequelize';

import { sequelize } from '../connection';

export const User = sequelize.define(
  'User',
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    login: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        is: /^[a-zA-Z0-9_.-]+$/,
      },
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        is: /^(?=.*[a-zA-Z])(?=.*[0-9])/,
      },
    },
    age: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        min: 4,
        max: 130,
      },
    },
    isDeleted: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);
