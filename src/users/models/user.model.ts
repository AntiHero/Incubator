import { Roles } from '../types/roles';
import { UserDomainModel } from '../types';
import { OptionalKey } from 'root/@core/types/utility';

export class User {
  public login: string;

  public password: string;

  public email: string;

  public role: Roles | null;

  constructor({
    login,
    password,
    email,
    role = null,
  }: OptionalKey<UserDomainModel, 'role'>) {
    this.login = login;
    this.password = password;
    this.email = email;
    this.role = role;
  }
}
