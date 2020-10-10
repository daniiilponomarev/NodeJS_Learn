import { Op } from 'sequelize';
import {
  GroupCreationRequestDTO,
  GroupDomain,
  GroupType,
} from '../../models/group-model';
import { Group } from './group-definition';

export const getGroupsData = async (
  limit: any = 10
): Promise<GroupDomain[]> => {
  return Group.findAll({
    limit: limit,
    order: [['name', 'ASC']],
  });
};

export const getGroupDataByName = async (
  name: string
): Promise<GroupDomain | null> => {
  return Group.findOne({
    where: {
      name: {
        [Op.eq]: name,
      },
    },
  });
};

export const getGroupDataById = async (
  id: string
): Promise<GroupDomain | null> => {
  return Group.findOne({
    where: {
      id: {
        [Op.eq]: id,
      },
    },
  });
};

export const createGroupData = async (
  newGroup: GroupCreationRequestDTO
): Promise<GroupDomain> => {
  return Group.create(newGroup);
};

export const updateGroupData = async (
  GroupForUpdate: GroupDomain,
  updatedGroup: GroupType
): Promise<GroupDomain> => {
  return GroupForUpdate.update(updatedGroup);
};

export const deleteGroupData = async (
  id: string
): Promise<GroupDomain | null> => {
  const existedGroup = await getGroupDataById(id);

  await existedGroup?.destroy();

  return existedGroup;
};
