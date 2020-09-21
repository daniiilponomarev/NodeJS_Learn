import {
  UserCreationRequestDTO,
  UserDomain,
} from '../models/user-model';
import {
  createUserData,
  deleteUserData,
  getAutoSuggestUsersData,
  getUserDataById,
  getUserDataByLogin,
  updateUserData,
} from '../data-access/user-dal';

export const getUser = async (id: string): Promise<UserDomain | null> => {
  return await getUserDataById(id);
};

export const createUser = async (
  newUser: UserCreationRequestDTO
): Promise<UserDomain> => {
  const existedUser = await getUserDataByLogin(newUser.login);

  if (existedUser) {
    return Promise.reject('Duplicated login');
  }

  const newUserWithId = {
    ...newUser,
    isDeleted: false,
  };

  return await createUserData(newUserWithId);
};

export const updateUser = async (
  login: string,
  user: UserCreationRequestDTO
): Promise<UserDomain> => {
  const userForUpdate = await getUserDataByLogin(login);

  if (!userForUpdate) {
    return Promise.reject('Undefined user');
  }

  const existedUser = await getUserDataByLogin(user.login);
  if (existedUser) {
    return Promise.reject('This login already exists');
  }

  const updatedUser = {
    id: userForUpdate.getDataValue('id') || '',
    isDeleted: userForUpdate.getDataValue('isDeleted'),
    ...user,
  };

  return await updateUserData(userForUpdate, updatedUser);
};

export const getAutoSuggestUsers = async (
  loginSubstring: any = '',
  limit: any = 10
): Promise<UserDomain[]> => {
  return await getAutoSuggestUsersData(loginSubstring, limit);
};

export const deleteUser = async (id: string): Promise<UserDomain | null> => {
  const userForDelete = await deleteUserData(id);

  if (!userForDelete) {
    return Promise.reject('Undefined user');
  }

  return userForDelete;
};
