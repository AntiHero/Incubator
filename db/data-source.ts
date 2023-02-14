import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  migrations: [__dirname + '/migrations/**/*.{ts,js}'],
  entities: ['./dist/src/**/*.entity.{ts,js}'],
  synchronize: false,
  migrationsRun: false,
};

export default new DataSource(dataSourceOptions);
