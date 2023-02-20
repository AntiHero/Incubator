import { WithId } from 'root/@core/types/utility';
import { Roles } from './roles';

export type UserDomainModel = {
  password: string;
  login: string;
  email: string;
  role: Roles | null;
};

export type BanInfo = {
  banDate: string | null;
  banReason: string | null;
  isBanned: boolean;
};

export type ConfirmationInfo = {
  isConfirmed: boolean;
  code: string;
  expDate: number;
};

export type PasswordRecovery = {
  code: string | null;
};

export type UserDTO = {
  id: string;
  login: string;
  email: string;
  banInfo: BanInfo;
  password?: string;
  confirmationInfo: ConfirmationInfo;
  passwordRecovery: PasswordRecovery;
  createdAt: string;
  role: Roles | null;
};

export type UserDomainModelWithId = WithId<UserDomainModel>;

export type UserInputModel = {
  password: string;
  login: string;
  email: string;
};

export type UserViewModel = {
  readonly id: string;
  login: string;
  email: string;
  createdAt: string;
  banInfo: BanInfo;
};

export type UserLoginType = {
  login: string;
  password: string;
};

export type UserInfoType = {
  email: string;
  login: string;
  userId: string;
};

export type UserDB = {
  id: number;
  login: string;
  email: string;
  banReason: string | null;
  banDate: Date | null;
  password: string;
  isBanned: boolean;
  isConfirmed: boolean;
  expDate: number;
  passwordRecoveryCode: string | null;
  confirmationCode: string | null;
  createdAt: Date;
  role: Roles;
};
