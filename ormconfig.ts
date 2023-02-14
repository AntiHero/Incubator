import * as dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';

dotenv.config();

export const config: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  migrationsRun: true,
  entities: [__dirname + '/src/**/*.entity.ts'],
  migrations: [__dirname + '/migrations/**/*.ts'],
  logging: 'all',
};
