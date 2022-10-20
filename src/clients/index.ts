import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const dbName = process.env.DB_NAME;
const testDbName = process.env.TEST_DB_NAME;
const url = process.env.MONGODB_URL as string;
const testUrl = process.env.MONGODB_TEST_URL as string;

export const client = new MongoClient(url);
export let testClient: MongoClient;

export let usersCollection = client.db(dbName).collection('users');
export let blogsCollection = client.db(dbName).collection('blogs');
export let postsCollection = client.db(dbName).collection('posts');
export let commentsCollection = client.db(dbName).collection('comments');
export let tokensBlackListCollection = client
  .db(dbName)
  .collection('tokensBlkLst');
export let deviceAuthSessions = client
  .db(dbName)
  .collection('deviceAuthSessions');

if (process.env.MODE === 'test') {
  testClient = new MongoClient(testUrl);
  usersCollection = testClient.db(testDbName).collection('users');
  blogsCollection = testClient.db(testDbName).collection('blogs');
  postsCollection = testClient.db(testDbName).collection('posts');
  commentsCollection = testClient.db(testDbName).collection('comments');
  deviceAuthSessions = client.db(testDbName).collection('deviceAuthSessions');
  tokensBlackListCollection = client.db(testDbName).collection('tokensBlkLst');
}
