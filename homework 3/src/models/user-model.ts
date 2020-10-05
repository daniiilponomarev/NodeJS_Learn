import { Model, Optional } from 'sequelize';

export type UserType = {
  id?: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
};

export type UserTypeDTO = {
  id: string;
  login: string;
  age: number;
};

export type UserCreationRequestDTO = {
  login: string;
  password: string;
  age: number;
};

export interface UserCreationAttributes extends Optional<UserType, 'id'> {}

export type UserDomain = Model<UserType, UserCreationAttributes>;
