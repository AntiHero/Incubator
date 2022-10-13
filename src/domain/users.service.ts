import jwt from 'jsonwebtoken';

import { h05, User } from '@/@types';
import UserModel from '@/models/User';
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
