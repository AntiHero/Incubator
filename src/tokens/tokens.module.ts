import { Module } from '@nestjs/common';

import { Token } from './entity/token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensService } from './tokens.service';
import { TokensRepository } from './adapters/tokens.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Token])],
  providers: [TokensService, TokensRepository],
  exports: [TokensService],
})
export class TokensModule {}
