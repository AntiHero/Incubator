import jwt from 'jsonwebtoken';

import UserModel from '@/models/User';
import { h05, User } from '@/@types';
import * as usersRepository from '@/repository/users.repository';
import { UserFields } from '@/enums';

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

export const checkUsersConfirmationCode = async (code: string) => {
  const user = await usersRepository.findUserByConfirmatinoCode(code);
  if (
    !user ||
    user.confirmationInfo.isConfirmed ||
    user.confirmationInfo.expDate < Date.now()
  )
    return null;

  return user._id.toString();
};

export const confirmUser = async (id: string) => {
  return usersRepository.findUserByIdAndUpdate(id, {
    [UserFields['confirmationInfo.isConfirmed']]: true,
  });
};
