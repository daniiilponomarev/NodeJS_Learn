import { GroupCreationRequestDTO, GroupDomain } from '../models/group-model';
import {
  createGroupData,
  deleteGroupData,
  getGroupsData,
  getGroupDataById,
  getGroupDataByName,
  updateGroupData,
} from '../data-access/group/group-dal';

export const getGroups = async (limit: any = 10): Promise<GroupDomain[]> => {
  return getGroupsData(limit);
};

export const getGroup = async (id: string): Promise<GroupDomain | null> => {
  const existedGroup = await getGroupDataById(id);

  if (!existedGroup) {
    throw Error(`No group with id=${id}`);
  }
  return existedGroup;
};

export const createGroup = async (
  newGroup: GroupCreationRequestDTO
): Promise<GroupDomain> => {
  const existedGroup = await getGroupDataByName(newGroup.name);

  if (existedGroup) {
    throw Error('Duplicated name');
  }

  return createGroupData(newGroup);
};

export const updateGroup = async (
  name: string,
  group: GroupCreationRequestDTO
): Promise<GroupDomain> => {
  const groupForUpdate = await getGroupDataByName(name);

  if (!groupForUpdate) {
    throw Error('Undefined group');
  }

  const existedGroup = await getGroupDataByName(group.name);
  if (existedGroup) {
    throw Error('This name already exists');
  }

  const updatedGroup = {
    id: groupForUpdate.getDataValue('id') || '',
    ...group,
  };

  return updateGroupData(groupForUpdate, updatedGroup);
};

export const deleteGroup = async (id: string): Promise<GroupDomain | null> => {
  const groupForDelete = await deleteGroupData(id);

  if (!groupForDelete) {
    throw Error('Undefined group');
  }

  return groupForDelete;
};
