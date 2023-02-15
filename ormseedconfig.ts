import { DataSourceOptions } from 'typeorm';
import { conf } from './ormconfig';

export const seedConf: DataSourceOptions = {
  ...conf,
  migrations: [process.cwd() + '/seeds/**/*.{ts,js}'],
};
