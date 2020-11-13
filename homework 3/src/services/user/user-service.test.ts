import {
  addUsersToGroup,
  createUser,
  deleteUser,
  getAutoSuggestUsers,
  getUser,
  getUserByCreds,
  updateUser,
} from './user-service';
import userDal from '../../data-access/user/user-dal';
import { UserDomain, UserLoginRequestDTO } from '../../models/user-model';

const userDomainMock = {
  id: '1',
  login: 'login1',
  password: 'password1',
  age: 50,
  isDeleted: false,
  getDataValue: (prop: string) => prop,
};

jest.mock('../../data-access/user/user-dal', () => {
  return {
    __esModule: true,
    default: jest.fn(() => {}),
  };
});
jest.mock('../../data-access/group/group-dal', () => {
  return {
    __esModule: true,
    default: jest.fn(() => {}),
  };
});

describe('user service', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('user getting', () => {
    test('should get user by id', async (done) => {
      userDal.getUserDataById = jest.fn().mockResolvedValue(userDomainMock);

      const user: UserDomain | null = await getUser('1');

      expect(userDal.getUserDataById).toHaveBeenCalled();
      expect(userDal.getUserDataById).toBeCalledWith('1');
      expect(user).toEqual(userDomainMock);

      done();
    });

    test('should get user by creds', async (done) => {
      userDal.getUserDataByCreds = jest.fn().mockResolvedValue(userDomainMock);

      const creds: UserLoginRequestDTO = {
        login: 'login',
        password: 'password',
      };
      const user: UserDomain | null = await getUserByCreds(creds);

      expect(userDal.getUserDataByCreds).toHaveBeenCalled();
      expect(userDal.getUserDataByCreds).toBeCalledWith(creds);
      expect(user).toEqual(userDomainMock);

      done();
    });

    test('should get error while getting user by creds', async (done) => {
      userDal.getUserDataByCreds = jest.fn().mockResolvedValue(null);

      const creds: UserLoginRequestDTO = {
        login: 'login',
        password: 'password',
      };
      try {
        await getUserByCreds(creds);
      } catch (e) {
        expect(e.errorMessage).toEqual('Incorrect login or password');
      }

      expect(userDal.getUserDataByCreds).toHaveBeenCalled();
      expect(userDal.getUserDataByCreds).toBeCalledWith(creds);

      done();
    });
  });

  describe('user creation', () => {
    test('should create user', async (done) => {
      userDal.getUserDataByLogin = jest.fn().mockResolvedValue(null);
      userDal.createUserData = jest.fn().mockResolvedValue(userDomainMock);

      const user: UserDomain | null = await createUser(userDomainMock);

      expect(userDal.getUserDataByLogin).toBeCalledWith(userDomainMock.login);
      expect(userDal.createUserData).toBeCalledWith(userDomainMock);
      expect(user).toEqual(userDomainMock);

      done();
    });

    test('should not create duplicated user', async (done) => {
      userDal.getUserDataByLogin = jest.fn().mockResolvedValue(userDomainMock);
      userDal.createUserData = jest.fn().mockResolvedValue(userDomainMock);

      try {
        await createUser(userDomainMock);
      } catch (e) {
        expect(e.errorMessage).toEqual('Duplicated login');
      }

      expect(userDal.getUserDataByLogin).toBeCalledWith(userDomainMock.login);
      expect(userDal.createUserData).not.toBeCalled();

      done();
    });
  });

  describe('user updating', () => {
    const updatedUser = {
      ...userDomainMock,
      login: 'login2',
    };

    test('should update user', async (done) => {
      userDal.getUserDataByLogin = jest
        .fn()
        .mockResolvedValueOnce(userDomainMock)
        .mockResolvedValueOnce(null);
      userDal.updateUserData = jest.fn().mockResolvedValue(updatedUser);

      const user: UserDomain | null = await updateUser('login1', updatedUser);

      expect(userDal.getUserDataByLogin).toHaveBeenNthCalledWith(1, 'login1');
      expect(userDal.getUserDataByLogin).toHaveBeenNthCalledWith(2, 'login2');
      expect(userDal.updateUserData).toBeCalledWith(
        userDomainMock,
        updatedUser
      );
      expect(user).toEqual(updatedUser);

      done();
    });

    test('should not update undefined user', async (done) => {
      userDal.getUserDataByLogin = jest.fn().mockResolvedValue(null);

      try {
        await updateUser('login1', updatedUser);
      } catch (e) {
        expect(e.errorMessage).toEqual('Undefined user');
      }

      expect(userDal.getUserDataByLogin).toBeCalledWith('login1');
      expect(userDal.getUserDataByLogin).toBeCalledTimes(1);
      expect(userDal.updateUserData).not.toBeCalled();

      done();
    });

    test('should not update user with the same login', async (done) => {
      userDal.getUserDataByLogin = jest.fn().mockResolvedValue(userDomainMock);

      try {
        await updateUser('login1', updatedUser);
      } catch (e) {
        expect(e.errorMessage).toEqual('This login already exists');
      }

      expect(userDal.getUserDataByLogin).toHaveBeenNthCalledWith(1, 'login1');
      expect(userDal.getUserDataByLogin).toHaveBeenNthCalledWith(2, 'login2');
      expect(userDal.updateUserData).not.toBeCalled();

      done();
    });
  });
});
