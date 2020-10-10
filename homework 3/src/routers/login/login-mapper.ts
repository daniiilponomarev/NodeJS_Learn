import { UserAuthTypeDTO, UserDomain } from '../../models/user-model';

export class LoginMapper {
  static mapUserToLoginDTO(user?: UserDomain | null): UserAuthTypeDTO | null {
    if (!user) {
      return null;
    }
    return {
      id: user.getDataValue('id') || '',
      login: user.getDataValue('login'),
    };
  }
}
