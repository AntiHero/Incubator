import { MongoClient } from 'mongodb';

const connectToDb = async (client: MongoClient) => {
  await client.connect();
};

export default connectToDb;
