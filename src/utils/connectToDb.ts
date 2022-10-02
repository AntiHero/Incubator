import { client } from '@/repository/collections';

const connectToDb = async () => {
  await client.connect();
};

export default connectToDb;
