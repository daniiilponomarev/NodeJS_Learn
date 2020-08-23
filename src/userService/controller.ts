import { User, UserRequestType } from './types';
import { users } from './data';

export const getUser = async (id: string): Promise<User | undefined> =>
  users.find((user: User) => user.id === id && !user.isDeleted);

export const createUser = async (newUser: UserRequestType): Promise<User> => {
  if (users.some((user: User): boolean => user.login === newUser.login)) {
    return Promise.reject('Duplicated login');
  }

  const newUserWithId = {
    ...newUser,
    id: users.length + 1 + '',
    isDeleted: false,
  };
  users.push(newUserWithId);

  return Promise.resolve(newUserWithId);
};

export const updateUser = async (
  login: string,
  user: UserRequestType
): Promise<User> => {
  const userForUpdate = users.find(
    (savedUser: User) => savedUser.login === login
  );

  if (!userForUpdate) {
    return Promise.reject('Undefined user');
  }

  if (
    users.some((savedUser: User): boolean => savedUser.login === user.login)
  ) {
    return Promise.reject('This login already exists');
  }

  const updatedUser = {
    ...userForUpdate,
    ...user,
  };
  users[users.indexOf(userForUpdate)] = updatedUser;

  return Promise.resolve(updatedUser);
};

export const getAutoSuggestUsers = async (
  loginSubstring: any = '',
  limit: any = 10
): Promise<User[]> => {
  return users
    .filter(
      (user) => !user.isDeleted && user.login.indexOf(loginSubstring) >= 0
    )
    .sort((user1, user2) => (user1.login > user2.login ? 1 : -1))
    .slice(0, limit);
};

export const deleteUser = async (login: string): Promise<User> => {
  const userForDelete = users.find(
    (savedUser: User) => savedUser.login === login
  );

  if (!userForDelete) {
    return Promise.reject('Undefined user');
  }

  userForDelete.isDeleted = true;

  return Promise.resolve(userForDelete);
};
