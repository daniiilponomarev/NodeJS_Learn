import { GroupDomain, GroupTypeDTO } from '../../models/group-model';

export class GroupMapper {
  static mapGroupToDTO(group?: GroupDomain | null): GroupTypeDTO | null {
    if (!group) {
      return null;
    }
    return {
      id: group.getDataValue('id') || '',
      name: group.getDataValue('name'),
      permissions: group.getDataValue('permissions'),
    };
  }
}
