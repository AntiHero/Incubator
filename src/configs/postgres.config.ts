import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getPostgresConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  const DEV_MODE = configService.get('DEV_MODE');

  return {
    type: 'postgres',
    url: configService.get('DATABASE_URL'),
    synchronize: true,
    autoLoadEntities: true,
    entities: [],
    logging: DEV_MODE ? 'all' : false,
  };
};
