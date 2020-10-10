import { Model, Optional } from 'sequelize';

export const READ = 'READ';
export const WRITE = 'WRITE';
export const DELETE = 'DELETE';
export const SHARE = 'SHARE';
export const UPLOAD_FILES = 'UPLOAD_FILES';

export type Permission =
  | typeof READ
  | typeof WRITE
  | typeof DELETE
  | typeof SHARE
  | typeof UPLOAD_FILES;

export type GroupType = {
  id?: string;
  name: string;
  permissions: Array<Permission>;
};

export type GroupTypeDTO = {
  id: string;
  name: string;
  permissions: Array<Permission>;
};

export type GroupCreationRequestDTO = {
  name: string;
  permissions: Array<Permission>;
};

export interface GroupCreationAttributes extends Optional<GroupType, 'id'> {}

export type GroupDomain = Model<GroupType, GroupCreationAttributes>;
