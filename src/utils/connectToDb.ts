import { client } from '@/repository/collections';

const connectToDb = async () => {
  return client.connect();
};

export default connectToDb;
