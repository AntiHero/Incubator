import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

export const config: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  migrations: [process.cwd() + '/dist/migrations/**/*.js'],
  entities: [process.cwd() + '/dist/src/**/*.entity.js'],
  synchronize: false,
};

export default new DataSource(config);
