import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';

import { UserFields } from '@/enums';
import UserModel from '@/models/User';
import { fiveMinInMs } from '@/constants';
import { convertToUser } from '@/utils/convertToUser';
import { User } from '@/adapters/mongoose/usersModel';
import * as EmailManager from '@/managers/emailManager';
import { h05, UserDBType, UserUpdatesType } from '@/@types';
// import * as usersRepository from '@/repository/users.repository';
import { UserMongooseAdapter } from '@/adapters/mongoose/usersAdapter';

const usersAdapter = new UserMongooseAdapter(User);

export const createUser = async (
  userData: h05.UserInputModel
): Promise<UserDBType | null> => {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(userData.password, saltRounds);

  const user = new UserModel(userData.login, userData.email, passwordHash);
  // const doc = await usersRepository.createUser(user);
  const doc = await usersAdapter.createUser(user);

  return doc;
};

export const deleteUser = async (id: string) => {
  // return usersRepository.findUserByIdAndDelete(id);
  return usersAdapter.findUserByIdAndDelete(id);
};

const generateTokens = (userForToken: Record<string, any>) => {
  const token = jwt.sign(userForToken, process.env.SECRET ?? 'simple_secret', {
    expiresIn: 10,
  });

  const refreshToken = jwt.sign(
    userForToken,
    process.env.SECRET ?? 'simple_secret',
    { expiresIn: 20 }
  );

  return [token, refreshToken];
};

export const authenticateUser = async ({
  login,
  password,
}: h05.LoginInputModel) => {
  // const user = await usersRepository.findUserByLogin(login);
  const user = await usersAdapter.findUserByLogin(login);

  if (!user) return null;

  const passwordCorrect = await bcrypt.compare(password, user.password);

  if (!passwordCorrect) return null;

  return user;
};

export const createTokensPair = async ({
  login,
  userId,
  deviceId,
}: {
  login?: string;
  userId?: string;
  deviceId?: string;
}) => {
  const userForToken = {
    username: login,
    id: userId,
    deviceId,
  };

  return generateTokens(userForToken);
};

export const getUser = async (userId: string) => {
  // return usersRepository.findUserById(userId);
  return usersAdapter.findUserById(userId);
};

export const checkUsersConfirmation = async (
  code: string
): Promise<string | null> => {
  // const user = await usersRepository.findUserByConfirmatinoCode(code);
  const user = await usersAdapter.findUserByConfirmationCode(code);

  if (
    !user ||
    user.confirmationInfo.isConfirmed ||
    user.confirmationInfo.expDate < Date.now()
  )
    return null;

  return user.id;
};

export const getUserConfirmationStatus = async (id: string) => {
  // const user = await usersRepository.findUserById(id);
  const user = await usersAdapter.findUserById(id);

  if (!user) return null;

  return user.confirmationInfo.isConfirmed;
};

export const findUserByConfirmationCode = async (code: string) => {
  // const user = await usersRepository.findUserByConfirmatinoCode(code);
  const user = await usersAdapter.findUserByConfirmationCode(code);

  if (!user) return null;

  return convertToUser(user);
};

export const confirmUser = async (id: string) => {
  // return usersRepository.findUserByIdAndUpdate(id, {
  //   [UserFields['confirmationInfo.isConfirmed']]: true,
  // });
  return usersAdapter.findUserByIdAndUpate(id, {
    [UserFields['confirmationInfo.isConfirmed']]: true,
  });
};

export const updateUser = async (
  id: string,
  updates: Partial<{ [K in UserUpdatesType]: any }>
) => {
  if (updates.password) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(updates.password, saltRounds);

    updates.password = passwordHash;
  }

  // return usersRepository.findUserByIdAndUpdate(id, updates);
  return usersAdapter.findUserByIdAndUpate(id, updates);
};

export const findUserByLoginOrEmail = async (loginOrEmail: string) => {
  // return usersRepository.findUserByLoginOrEmail(loginOrEmail);
  return usersAdapter.findUserByLoginOrEmail(loginOrEmail);
};

export const resendConfirmationEmail = async (id: string, email: string) => {
  const newCode = uuid();

  // await usersRepository.findUserByIdAndUpdate(id, {
  //   'confirmationInfo.expDate': Date.now() + fiveMinInMs,
  //   'confirmationInfo.code': newCode,
  // });
  await usersAdapter.findUserByIdAndUpate(id, {
    'confirmationInfo.expDate': Date.now() + fiveMinInMs,
    'confirmationInfo.code': newCode,
  });

  await EmailManager.sendConfirmationEmail({
    to: email as string,
    code: newCode,
  });
};

export const sendRecoveryEmail = async (id: string, email: string) => {
  const newCode = uuid();

  // await usersRepository.findUserByIdAndUpdate(id, {
  //   'passwordRecovery.code': newCode,
  // });

  await usersAdapter.findUserByIdAndUpate(id, {
    'passwordRecovery.code': newCode,
  });

  await EmailManager.sendRecoveryEmail({
    to: email,
    code: newCode,
  });
};

export const checkRecoveryCode = async (code: string) => {
  // const dbUser = await usersRepository.findUserByRecoveryCode(code);
  const dbUser = await usersAdapter.findUserByRecoveryCode(code);

  if (!dbUser || dbUser.passwordRecovery.code !== code) return null;

  return convertToUser(dbUser).id;
};
