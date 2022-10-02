import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionUrl = process.env.MONGODB_URL as string;
const dbName = process.env.DB_NAME;

export const client = new MongoClient(connectionUrl);
export const blogsCollection = client.db(dbName).collection('blogs');
export const postsCollection = client.db(dbName).collection('posts');
