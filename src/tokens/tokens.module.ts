import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { TokensService } from './tokens.service';
import { TokenModel } from './schemas/token.schema';
import { TokensAdapter } from './adapters/mongoose';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: TokenModel,
        schemaOptions: { collection: 'tokens' },
      },
    ]),
  ],
  providers: [TokensService, TokensAdapter],
  exports: [TokensService],
})
export class TokensModule {}
