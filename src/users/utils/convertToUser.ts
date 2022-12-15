import { UserDB, UserDTO } from '../types';
import { ConvertToEntity } from 'root/@common/utils/convert';

export class ConvertToUser implements ConvertToEntity {
  static convertToDTO(doc: UserDB): UserDTO {
    return {
      id: String(doc.id),
      login: doc.login,
      email: doc.email,
      banInfo: {
        banDate: doc.banDate ? doc.banDate.toISOString() : null,
        banReason: doc.banReason,
        isBanned: doc.isBanned,
      },
      password: doc.password,
      role: doc.role,
      confirmationInfo: {
        isConfirmed: doc.isConfirmed,
        code: doc.confirmationCode,
        expDate: doc.expDate,
      },
      passwordRecovery: {
        code: doc.passwordRecoveryCode,
      },
      createdAt: doc.createdAt?.toISOString(),
    };
  }
}
