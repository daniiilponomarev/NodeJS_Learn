import { UserDomain, UserTypeDTO } from '../../models/user-model';

export class UserMapper {
  static mapUserToDTO(user?: UserDomain | null): UserTypeDTO | null {
    if (!user) {
      return null;
    }
    return {
      id: user.getDataValue('id') || '',
      login: user.getDataValue('login'),
      age: user.getDataValue('age'),
    };
  }
}
