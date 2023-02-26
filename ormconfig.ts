import * as dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';

dotenv.config();

export const conf: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  // migrationsRun: true,
  entities: ['./src/**/*.entity{.ts,.js}'],
  migrations: ['./migrations/**/*{.ts,.js}'],
  logging: 'all',
};
