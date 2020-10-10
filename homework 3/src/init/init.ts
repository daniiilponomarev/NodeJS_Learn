import { User } from '../data-access/user/user-definition';
import { Group } from '../data-access/group/group-definition';
import { UserGroup } from '../data-access/user-group/user-group-definition';
import { UserType } from '../models/user-model';
import { DELETE, GroupType, READ, SHARE, WRITE } from '../models/group-model';

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

export const groupsData: GroupType[] = [
  {
    name: 'group2',
    permissions: [READ],
  },
  {
    name: 'group3',
    permissions: [READ, WRITE],
  },
  {
    name: 'group1',
    permissions: [READ, WRITE, SHARE, DELETE],
  },
];

const initUsers = async () => {
  await User.sync({ force: true });
  await User.bulkCreate(usersData);
};

const initGroups = async () => {
  await Group.sync({ force: true });
  await Group.bulkCreate(groupsData);
};

const initUserGroups = async () => {
  await UserGroup.sync({ force: true });
};

export const init = async () => {
  await initUsers()
    .then(() => {
      console.log('Users table has been initialized');
    })
    .catch((err) => console.log(err));

  await initGroups()
    .then(() => {
      console.log('Groups table has been initialized');
    })
    .catch((err) => console.log(err));

  await initUserGroups()
    .then(() => {
      console.log('UserGroup table has been initialized');
    })
    .catch((err) => console.log(err));
};
