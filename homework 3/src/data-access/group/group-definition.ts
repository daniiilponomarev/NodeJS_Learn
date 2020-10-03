import { DataTypes } from 'sequelize';

import { sequelize } from '../connection';
import { Permission } from '../../models/group-model';

export const Group = sequelize.define(
  'Group',
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        is: /^[a-zA-Z0-9_.-]+$/,
      },
    },
    permissions: {
      allowNull: false,
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);
