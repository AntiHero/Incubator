import { Injectable } from '@nestjs/common';

import { TokenDTO } from './types';
import { TokensAdapter } from './adapters/mongoose';

@Injectable()
export class TokensService {
  constructor(private readonly tokensRepository: TokensAdapter) {}

  async saveToken(data: Omit<TokenDTO, 'blackListed'>) {
    return this.tokensRepository.save(data);
  }

  async findTokenByQuery(query: Partial<TokenDTO>) {
    return this.tokensRepository.findByQuery(query);
  }

  async deleteAllTokens() {
    return this.tokensRepository.deleteAll();
  }
}
