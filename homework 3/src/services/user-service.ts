import {
  UserCreationRequestDTO,
  UserDomain,
  UserLoginRequestDTO,
} from '../models/user-model';
import {
  addUsersToGroupData,
  createUserData,
  deleteUserData,
  getAutoSuggestUsersData,
  getUserDataByCreds,
  getUserDataById,
  getUserDataByLogin,
  getUsersDataByIds,
  updateUserData,
} from '../data-access/user/user-dal';
import { getGroupDataById } from '../data-access/group/group-dal';
import { ServiceError } from './service-errors';

export const getUser = async (id: string): Promise<UserDomain | null> => {
  return getUserDataById(id);
};

export const getUserByCreds = async (
  creds: UserLoginRequestDTO
): Promise<UserDomain | null> => {
  const user = await getUserDataByCreds(creds);

  if (!user) {
    throw new ServiceError('Incorrect login or password');
  }

  return user;
};

export const createUser = async (
  newUser: UserCreationRequestDTO
): Promise<UserDomain> => {
  const existedUser = await getUserDataByLogin(newUser.login);

  if (existedUser) {
    throw new ServiceError('Duplicated login');
  }

  const newUserWithId = {
    ...newUser,
    isDeleted: false,
  };

  return createUserData(newUserWithId);
};

export const updateUser = async (
  login: string,
  user: UserCreationRequestDTO
): Promise<UserDomain> => {
  const userForUpdate = await getUserDataByLogin(login);

  if (!userForUpdate) {
    throw new ServiceError('Undefined user');
  }

  const existedUser = await getUserDataByLogin(user.login);
  if (existedUser) {
    throw new ServiceError('This login already exists');
  }

  const updatedUser = {
    id: userForUpdate.getDataValue('id') || '',
    isDeleted: userForUpdate.getDataValue('isDeleted'),
    ...user,
  };

  return updateUserData(userForUpdate, updatedUser);
};

export const getAutoSuggestUsers = async (
  loginSubstring: any = '',
  limit: any = 10
): Promise<UserDomain[]> => {
  return getAutoSuggestUsersData(loginSubstring, limit);
};

export const deleteUser = async (id: string): Promise<UserDomain | null> => {
  const userForDelete = await deleteUserData(id);

  if (!userForDelete) {
    throw new ServiceError('Undefined user');
  }

  return userForDelete;
};

export const addUsersToGroup = async (
  groupId: string,
  userIds: string[]
): Promise<any> => {
  const { rows, count } = await getUsersDataByIds(userIds);

  if (count !== userIds.length) {
    throw new ServiceError('Some of users do not exist');
  }

  const existedGroup = await getGroupDataById(groupId);
  if (!existedGroup) {
    throw new ServiceError(`Group ${groupId} does not exists`);
  }

  await addUsersToGroupData(groupId, userIds, existedGroup);
};
