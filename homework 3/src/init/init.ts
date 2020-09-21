import { sequelize } from '../data-access/connection';
import { User } from '../data-access/user-definition';
import { UserType } from '../models/user-model';

export const usersData: UserType[] = [
  {
    login: 'login2',
    password: 'password2',
    age: 25,
    isDeleted: false,
  },
  {
    login: 'login3',
    password: 'password3',
    age: 30,
    isDeleted: false,
  },
  {
    login: 'login1',
    password: 'password1',
    age: 20,
    isDeleted: false,
  },
];

const initUsers = async () => {
  await sequelize.authenticate();
  await User.sync({ force: true });
  await User.bulkCreate(usersData);
};

export const init = () => {
  return Promise.all([
    initUsers()
      .then(() => {
        console.log('Users table has been initialized');
      })
      .catch((err) => console.log(err)),
  ]);
};
