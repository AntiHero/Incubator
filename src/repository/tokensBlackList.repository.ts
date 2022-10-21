import { TokenInputModel } from '@/@types';
import { tokensBlackListCollection } from '@/clients';

export const saveToken = async (token: TokenInputModel) => {
  const { insertedId } = await tokensBlackListCollection.insertOne({
    ...token,
  });

  return insertedId;
};

export const findTokenByValue = async (value: string) => {
  const doc = await tokensBlackListCollection.findOne({ value });

  if (!doc) return null;

  return doc;
};

export const deleteAll = async () => {
  await tokensBlackListCollection.deleteMany({});
};
