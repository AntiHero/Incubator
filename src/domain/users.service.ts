import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

import { UserFields } from '@/enums';
import UserModel from '@/models/User';
import { fiveMinInMs } from '@/constants';
import { h05, User, UserUpdatesType } from '@/@types';
import { convertToUser } from '@/utils/convertToUser';
import * as EmailManager from '@/managers/emailManager';
import * as usersRepository from '@/repository/users.repository';

export const createUser = async (
  userData: h05.UserInputModel
): Promise<User | null> => {
  const user = new UserModel(userData.login, userData.email, userData.password);
  const doc = await usersRepository.createUser(user);

  return doc;
};

export const deleteUser = async (id: string) => {
  return usersRepository.findUserByIdAndDelete(id);
};

export const authenticateUser = async ({
  login,
  password,
}: h05.LoginInputModel) => {
  const user = await usersRepository.findUserByLoginAndPassword(
    login,
    password
  );

  if (!user) return null;

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET ?? 'simple_secret');

  return token;
};

export const getUser = async (userId: string) => {
  return usersRepository.findUserById(userId);
};

export const checkUsersConfirmation = async (code: string) => {
  const user = await usersRepository.findUserByConfirmatinoCode(code);
  if (
    !user ||
    user.confirmationInfo.isConfirmed ||
    user.confirmationInfo.expDate < Date.now()
  )
    return null;

  return user._id.toString();
};

export const getUserConfirmationStatus = async (id: string) => {
  const user = await usersRepository.findUserById(id);

  if (!user) return null;

  return user.confirmationInfo.isConfirmed;
};

export const findUserByConfirmationCode = async (code: string) => {
  const user = await usersRepository.findUserByConfirmatinoCode(code);

  if (!user) return null;

  return convertToUser(user);
};

export const confirmUser = async (id: string) => {
  return usersRepository.findUserByIdAndUpdate(id, {
    [UserFields['confirmationInfo.isConfirmed']]: true,
  });
};

export const updateUser = async (
  id: string,
  updates: Partial<{ [K in UserUpdatesType]: any }>
) => {
  return usersRepository.findUserByIdAndUpdate(id, updates);
};

export const findUserByLoginOrEmail = async (loginOrEmail: string) => {
  return usersRepository.findUserByLoginOrEmail(loginOrEmail);
};

export const resendConfirmationEmail = async (id: string, email: string) => {
  const newCode = uuid();

  await usersRepository.findUserByIdAndUpdate(id, {
    'confirmationInfo.expDate': Date.now() + fiveMinInMs,
    'confirmationInfo.code': newCode,
  });

  await EmailManager.sendConfirmationEmail({
    to: email as string,
    code: newCode,
  });
};
