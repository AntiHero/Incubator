import { Module } from '@nestjs/common';
import { TokensListService } from './tokens-list.service';

@Module({
  providers: [TokensListService],
})
export class TokensListModule {}
