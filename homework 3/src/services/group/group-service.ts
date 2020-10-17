import { GroupCreationRequestDTO, GroupDomain } from '../../models/group-model';
import groupDal from '../../data-access/group/group-dal';
import {ServiceError} from "../service-errors";

export const getGroups = async (limit: any = 10): Promise<GroupDomain[]> => {
  return groupDal.getGroupsData(limit);
};

export const getGroup = async (id: string): Promise<GroupDomain | null> => {
  const existedGroup = await groupDal.getGroupDataById(id);

  if (!existedGroup) {
    throw new ServiceError(`No group with id=${id}`);
  }
  return existedGroup;
};

export const createGroup = async (
  newGroup: GroupCreationRequestDTO
): Promise<GroupDomain> => {
  const existedGroup = await groupDal.getGroupDataByName(newGroup.name);

  if (existedGroup) {
    throw new ServiceError('Duplicated name');
  }

  return groupDal.createGroupData(newGroup);
};

export const updateGroup = async (
  name: string,
  group: GroupCreationRequestDTO
): Promise<GroupDomain> => {
  const groupForUpdate = await groupDal.getGroupDataByName(name);

  if (!groupForUpdate) {
    throw new ServiceError('Undefined group');
  }

  const existedGroup = await groupDal.getGroupDataByName(group.name);
  if (existedGroup) {
    throw new ServiceError('This name already exists');
  }

  const updatedGroup = {
    id: groupForUpdate.getDataValue('id') || '',
    ...group,
  };

  return groupDal.updateGroupData(groupForUpdate, updatedGroup);
};

export const deleteGroup = async (id: string): Promise<GroupDomain | null> => {
  const groupForDelete = await groupDal.deleteGroupData(id);

  if (!groupForDelete) {
    throw new ServiceError('Undefined group');
  }

  return groupForDelete;
};
