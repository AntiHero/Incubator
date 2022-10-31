import 'module-alias/register';
import * as dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URL as string;

import app from './app';
import { client } from '@/clients';
import connectToDb from './utils/connectToDb';
import connectToDbWithMongoose from './utils/connnectToDbWithMongoose';

connectToDb(client)
  .then(() => connectToDbWithMongoose(uri))
  .then(
    () => {
      console.log('\x1b[36m%s\x1b[0m', 'Connected to MongoDb');

      app.listen(app.get('port'), () => {
        console.log(
          'Server is running at http://localhost:%s',
          app.get('port')
        );
      });
    },
    () => console.error('Connenction error')
  );
