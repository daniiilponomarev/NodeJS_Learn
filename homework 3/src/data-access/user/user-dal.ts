import { Op } from 'sequelize';
import {
  UserCreationRequestDTO,
  UserDomain,
  UserType,
} from '../../models/user-model';
import { User } from './user-definition';

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
