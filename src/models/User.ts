import { h05, UserConfirmationType } from '@/@types';
import { v4 as uuidv4 } from 'uuid';

const fiveMinInMs = 5 * 60 * 1000;

class UserModel implements h05.UserInputModel {
  public createdAt: Date;

  public confirmationInfo: UserConfirmationType;

  constructor(
    public login: string,
    public email: string,
    public password: string
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
  }
}

export default UserModel;
