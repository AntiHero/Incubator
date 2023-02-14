import { DataSourceOptions } from 'typeorm';

export const config: DataSourceOptions = {
  type: 'postgres',
  url: 'postgres://postgres:postgres@localhost/incubator',
  synchronize: false,
  entities: ['./src/**/*.entity.ts'],
  migrations: [__dirname + '/migrations/**/*.ts'],
  logging: 'all',
};
