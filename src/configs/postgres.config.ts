import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getPostgresConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  const DEV_MODE = configService.get('DEV_MODE');

  return {
    type: 'postgres',
    url: configService.get('DATABASE_URL'),
    entities: [],
    migrationsRun: true,
    synchronize: false,
    autoLoadEntities: true,
    logging: DEV_MODE ? 'all' : false,
    migrations: [process.cwd() + '/dist/migrations/**/*.{ts,js}'],
  };
};
