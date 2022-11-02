import { ObjectId } from 'mongodb';

import { UserFields } from '@/enums';
import UserModel from '@/models/User';
import { usersCollection } from '@/clients';
import { countSkip } from '@/utils/countSkip';
import { PaginationQuery, UserDBType, UserUpdatesType } from '@/@types';
import { HydratedDocument } from 'mongoose';

export const createUser = async (userData: UserModel): Promise<UserDBType> => {
  await usersCollection.insertOne(userData);

  return userData as unknown as UserDBType;
};

export const findUserById = async (id: string | ObjectId) => {
  const doc = await usersCollection.findOne<UserDBType>({
    _id: typeof id === 'string' ? new ObjectId(id) : id,
  });

  if (!doc) return null;

  return doc;
};

export const findUserByIdAndUpdate = async (
  id: string,
  updates: Partial<{ [K in UserUpdatesType]: any }>
) => {
  const result = await usersCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );

  if (result.modifiedCount === 1) return true;

  return null;
};

export const findUserByIdAndDelete = async (id: string) => {
  const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 1) return true;

  return null;
};

export const findUserByLogin = async (login: string) => {
  return usersCollection.findOne<UserDBType>({ login });
};

export const findUserByLoginOrEmail = async (loginOrEmail: string) => {
  const user = await usersCollection.findOne<UserDBType>({
    $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
  });

  return user;
};

export const getUsersCount = async (query: Partial<PaginationQuery>) => {
  const cursor = await usersCollection
    .aggregate<{ totalCount: number }>([
      {
        $match: {
          $or: [
            { login: { $regex: query.searchLoginTerm } },
            { email: { $regex: query.searchEmailTerm } },
          ],
        },
      },
      {
        $count: 'totalCount',
      },
    ])
    .toArray();

  return cursor.length ? cursor[0].totalCount : 0;
};

export const findUsersByQuery = async (query: PaginationQuery) => {
  const users = await usersCollection
    .aggregate<UserDBType>([
      {
        $match: {
          $or: [
            { login: { $regex: query.searchLoginTerm } },
            { email: { $regex: query.searchEmailTerm } },
          ],
        },
      },
      {
        $sort: { [query.sortBy]: query.sortDirection },
      },
      {
        $skip: countSkip(query.pageSize, query.pageNumber),
      },
      {
        $limit: query.pageSize,
      },
    ])
    .toArray();

  return users;
};

export const findUserByRecoveryCode = async (code: string) => {
  return usersCollection.findOne<UserDBType>({
    [UserFields['passwordRecovery.code']]: code,
  });
};

export const findUserByConfirmatinoCode = async (code: string) => {
  return usersCollection.findOne<HydratedDocument<UserModel>>({
    [UserFields['confirmationInfo.code']]: code,
  });
};

export const deleteAll = async () => {
  await usersCollection.deleteMany({});
};
