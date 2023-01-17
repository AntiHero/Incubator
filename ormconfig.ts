import { DataSourceOptions } from 'typeorm';

export const config: DataSourceOptions = {
  type: 'postgres',
  url: 'postgres://postgres:postgres@localhost/incubator',
  synchronize: true,
  entities: ['./src/**/*.entity.ts'],
  logging: 'all',
};
