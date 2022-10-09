import { ObjectId } from 'mongodb';

import { PaginationQuery, User } from '@/@types';
import UserModel from '@/models/User';
import { usersCollection } from './collections';
import { countSkip } from '@/utils/countSkip';

export const createUser = async (userData: UserModel): Promise<User> => {
  await usersCollection.insertOne(userData);

  // userData will be equal to created user (mutated during insertion process)
  return userData as unknown as User;
};

export const findUserById = async (id: string | ObjectId) => {
  const doc = await usersCollection.findOne<User>({
    _id: typeof id === 'string' ? new ObjectId(id) : id,
  });

  if (!doc) return null;

  return doc;
};

export const findUserByIdAndDelete = async (id: string) => {
  const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 1) return true;

  return null;
};

export const findUserByLoginAndPassword = async (
  login: string,
  password: string
) => {
  return usersCollection.findOne({ login, password });
};

export const findUserByLoginOrEmail = async (loginOrEmail: string) => {
  const user = await usersCollection.findOne<User>({
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
    .aggregate<User>([
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

export const deleteAll = async () => {
  await usersCollection.deleteMany({});
};
