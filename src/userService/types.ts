export type User = {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
};

export type UserRequestType = {
  login: string;
  password: string;
  age: number;
};
