import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const dbName = process.env.DB_NAME;
const testDbName = process.env.TEST_DB_NAME;
const url = process.env.MONGODB_URL as string;
const testUrl = process.env.MONGODB_TEST_URL as string;

export const client = new MongoClient(url);
export const testClient = new MongoClient(testUrl);

export let usersCollection = client.db(dbName).collection('users');
export let blogsCollection = client.db(dbName).collection('blogs');
export let postsCollection = client.db(dbName).collection('posts');

if (process.env.MODE === 'test') {
  usersCollection = testClient.db(testDbName).collection('users');
  blogsCollection = testClient.db(testDbName).collection('blogs');
  postsCollection = testClient.db(testDbName).collection('posts');
}
