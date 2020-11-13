import { Op } from 'sequelize';

import { sequelize } from '../connection';
import {
  UserCreationRequestDTO,
  UserDomain,
  UserLoginRequestDTO,
  UserType,
} from '../../models/user-model';
import { User } from './user-definition';
import { UserGroup } from '../user-group/user-group-definition';
import { GroupDomain } from '../../models/group-model';

export const getUserDataByLogin = async (
  login: string
): Promise<UserDomain | null> => {
  return User.findOne({
    where: {
      login: {
        [Op.eq]: login,
      },
      // isDeleted: false,
    },
    // raw: true,
  });
};

export const getUserDataById = async (
  id: string
): Promise<UserDomain | null> => {
  return User.findOne({
    where: {
      id: {
        [Op.eq]: id,
      },
      isDeleted: false,
    },
    // raw: true,
  });
};

export const getUserDataByCreds = async (
  creds: UserLoginRequestDTO
): Promise<UserDomain | null> => {
  return User.findOne({
    where: {
      login: {
        [Op.eq]: creds.login,
      },
      password: {
        [Op.eq]: creds.password,
      },
      isDeleted: false,
    },
  });
};

export const getUsersDataByIds = async (
  ids: string[]
): Promise<{ rows: UserDomain[]; count: number }> => {
  return User.findAndCountAll({
    where: {
      id: {
        [Op.in]: ids,
      },
      isDeleted: false,
    },
  });
};

export const createUserData = async (
  newUser: UserCreationRequestDTO
): Promise<UserDomain> => {
  return User.create(newUser);
};

export const updateUserData = async (
  userForUpdate: UserDomain,
  updatedUser: UserType
): Promise<UserDomain> => {
  return userForUpdate.update(updatedUser);
};

export const getAutoSuggestUsersData = async (
  loginSubstring: any = '',
  limit: any = 10
): Promise<UserDomain[]> => {
  return User.findAll({
    where: {
      login: {
        [Op.like]: `%${loginSubstring}%`,
      },
      isDeleted: false,
    },
    limit: limit,
    order: [['login', 'ASC']],
    // raw: true,
  });
};

export const deleteUserData = async (
  id: string
): Promise<UserDomain | null> => {
  const user: UserDomain | null = await User.findOne({
    where: {
      id: {
        [Op.eq]: id,
      },
      isDeleted: false,
    },
    // raw: true,
  });
  await user?.update({ isDeleted: true });

  return user;
};

export const addUsersToGroupData = async (
  groupId: string,
  userIds: string[],
  group: GroupDomain
): Promise<void> => {
  const groupId1 = group.getDataValue('id');
  const newData = userIds.map((userId) => ({
    GroupId: groupId1,
    UserId: userId,
  }));
  await sequelize.transaction(async () => {
    await UserGroup.bulkCreate(newData);
  });
};
