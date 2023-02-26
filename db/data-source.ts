import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

export const config: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  migrations: ['dist/migrations/**/*{.ts,.js}'],
  entities: ['dist/src/**/*.entity{.ts,.js}'],
  synchronize: false,
};

console.log(config);

export default new DataSource(config);
