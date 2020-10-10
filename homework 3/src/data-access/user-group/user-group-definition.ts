import { DataTypes } from 'sequelize';

import { sequelize } from '../connection';
import { User } from '../user/user-definition';
import { Group } from '../group/group-definition';

export const UserGroup = sequelize.define(
  'UserGroup',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

