import { DataSourceOptions } from 'typeorm';

export const config: DataSourceOptions = {
  type: 'postgres',
  url: 'postgres://postgres:postgres@localhost/incubator',
  // url:
  //   'postgres://AntiHero:IxvedgX63UNB@ep-shrill-math-339824.eu-central-1.aws.neon.tech/Incubator?sslmode=require',
  synchronize: true,
  entities: ['./src/**/*.entity.ts'],
  logging: 'all',
};
