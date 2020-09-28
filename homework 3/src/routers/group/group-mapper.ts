import { GroupDomain, GroupTypeDTO } from '../../models/group-model';

export class GroupMapper {
  static mapGroupToDTO(user?: GroupDomain | null): GroupTypeDTO | null {
    if (!user) {
      return null;
    }
    return {
      id: user.getDataValue('id') || '',
      name: user.getDataValue('name'),
      permissions: user.getDataValue('permissions'),
    };
  }
}
