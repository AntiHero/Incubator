import * as dotenv from 'dotenv';
import { Collection, Document, MongoClient } from 'mongodb';

dotenv.config();

const dbName = process.env.DB_NAME;
const testDbName = process.env.TEST_DB_NAME;
const url = process.env.MONGODB_URL as string;
const testUrl = process.env.MONGODB_TEST_URL as string;

export let client: MongoClient;
export let testClient: MongoClient;

export let usersCollection: Collection<Document>;
export let blogsCollection: Collection<Document>;
export let postsCollection: Collection<Document>;
export let commentsCollection: Collection<Document>;
export let deviceAuthSessions: Collection<Document>;
export let tokensBlackListCollection: Collection<Document>;

if (process.env.MODE === 'test') {
  testClient = new MongoClient(testUrl);
  usersCollection = testClient.db(testDbName).collection('users');
  blogsCollection = testClient.db(testDbName).collection('blogs');
  postsCollection = testClient.db(testDbName).collection('posts');
  commentsCollection = testClient.db(testDbName).collection('comments');
  deviceAuthSessions = testClient
    .db(testDbName)
    .collection('deviceAuthSessions');
  tokensBlackListCollection = testClient
    .db(testDbName)
    .collection('tokensBlkLst');
} else {
  client = new MongoClient(url);
  usersCollection = client.db(dbName).collection('users');
  blogsCollection = client.db(dbName).collection('blogs');
  postsCollection = client.db(dbName).collection('posts');
  commentsCollection = client.db(dbName).collection('comments');
  tokensBlackListCollection = client.db(dbName).collection('tokensBlkLst');
  deviceAuthSessions = client.db(dbName).collection('deviceAuthSessions');
}
