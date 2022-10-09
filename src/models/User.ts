import { h05 } from '@/@types';

class UserModel implements h05.UserInputModel {
  public createdAt: Date;

  constructor(
    public login: string,
    public email: string,
    public password: string
  ) {
    this.login = login;
    this.email = email;
    this.password = password;
    this.createdAt = new Date();
  }
}

export default UserModel;
