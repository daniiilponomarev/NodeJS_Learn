import {
  UserCreationRequestDTO,
  UserDomain,
  UserLoginRequestDTO,
} from '../../models/user-model';
import userDal from '../../data-access/user/user-dal';
import groupDal from '../../data-access/group/group-dal';
import { ServiceError } from '../service-errors';

export const getUser = async (id: string): Promise<UserDomain | null> => {
  return userDal.getUserDataById(id);
};

export const getUserByCreds = async (
  creds: UserLoginRequestDTO
): Promise<UserDomain | null> => {
  const user = await userDal.getUserDataByCreds(creds);

  if (!user) {
    throw new ServiceError('Incorrect login or password');
  }

  return user;
};

export const createUser = async (
  newUser: UserCreationRequestDTO
): Promise<UserDomain> => {
  const existedUser = await userDal.getUserDataByLogin(newUser.login);

  if (existedUser) {
    throw new ServiceError('Duplicated login');
  }

  const newUserWithId = {
    ...newUser,
    isDeleted: false,
  };

  return userDal.createUserData(newUserWithId);
};

export const updateUser = async (
  login: string,
  user: UserCreationRequestDTO
): Promise<UserDomain> => {
  const userForUpdate = await userDal.getUserDataByLogin(login);

  if (!userForUpdate) {
    throw new ServiceError('Undefined user');
  }

  const existedUser = await userDal.getUserDataByLogin(user.login);
  if (existedUser) {
    throw new ServiceError('This login already exists');
  }

  const updatedUser = {
    id: userForUpdate.getDataValue('id') || '',
    isDeleted: userForUpdate.getDataValue('isDeleted'),
    ...user,
  };

  return userDal.updateUserData(userForUpdate, updatedUser);
};

export const getAutoSuggestUsers = async (
  loginSubstring: any = '',
  limit: any = 10
): Promise<UserDomain[]> => {
  return userDal.getAutoSuggestUsersData(loginSubstring, limit);
};

export const deleteUser = async (id: string): Promise<UserDomain | null> => {
  const userForDelete = await userDal.deleteUserData(id);

  if (!userForDelete) {
    throw new ServiceError('Undefined user');
  }

  return userForDelete;
};

export const addUsersToGroup = async (
  groupId: string,
  userIds: string[]
): Promise<any> => {
  const { rows, count } = await userDal.getUsersDataByIds(userIds);

  if (count !== userIds.length) {
    throw new ServiceError('Some of users do not exist');
  }

  const existedGroup = await groupDal.getGroupDataById(groupId);
  if (!existedGroup) {
    throw new ServiceError(`Group ${groupId} does not exists`);
  }

  await userDal.addUsersToGroupData(groupId, userIds, existedGroup);
};
