import { WithId } from 'root/@common/types/utility';

export type UserDomainModel = {
  password: string;
  login: string;
  email: string;
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
  password: string;
  banInfo: BanInfo;
  confirmationInfo: ConfirmationInfo;
  passwordRecover: PasswordRecovery;
  createdAt: string;
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
