import { v4 as uuidv4 } from 'uuid';

import { fiveMinInMs } from '@/constants';
import { h05, PasswordRecoveryType, UserConfirmationType } from '@/@types';

class UserModel implements h05.UserInputModel {
  public createdAt: Date;

  public confirmationInfo: UserConfirmationType;

  public passwordRecovery: PasswordRecoveryType;

  constructor(
    public login: string,
    public password: string,
    public email: string
  ) {
    this.login = login;
    this.email = email;
    this.password = password;
    this.createdAt = new Date();
    this.confirmationInfo = {
      isConfirmed: false,
      code: uuidv4(),
      expDate: Date.now() + fiveMinInMs,
    };
    this.passwordRecovery = {
      code: null,
    };
  }
}

export default UserModel;
