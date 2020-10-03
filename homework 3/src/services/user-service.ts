import { UserCreationRequestDTO, UserDomain } from '../models/user-model';
import {
  addUsersToGroupData,
  createUserData,
  deleteUserData,
  getAutoSuggestUsersData,
  getUserDataById,
  getUserDataByLogin,
  getUsersDataByIds,
  updateUserData,
} from '../data-access/user/user-dal';
import { getGroupDataById } from '../data-access/group/group-dal';

export const getUser = async (id: string): Promise<UserDomain | null> => {
  return getUserDataById(id);
};

export const createUser = async (
  newUser: UserCreationRequestDTO
): Promise<UserDomain> => {
  const existedUser = await getUserDataByLogin(newUser.login);

  if (existedUser) {
    throw Error('Duplicated login');
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
    throw Error('Undefined user');
  }

  const existedUser = await getUserDataByLogin(user.login);
  if (existedUser) {
    throw Error('This login already exists');
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
    throw Error('Undefined user');
  }

  return userForDelete;
};

export const addUsersToGroup = async (
  groupId: string,
  userIds: string[]
): Promise<any> => {
  const { rows, count } = await getUsersDataByIds(userIds);

  if (count !== userIds.length) {
    throw Error('Some of users do not exist');
  }

  const existedGroup = await getGroupDataById(groupId);
  if (!existedGroup) {
    throw Error(`Group ${groupId} does not exists`);
  }

  await addUsersToGroupData(groupId, userIds, existedGroup);
};
