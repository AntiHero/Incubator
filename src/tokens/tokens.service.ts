import { Injectable } from '@nestjs/common';

import { TokenDTO } from './types';
import { TokensRepository } from './adapters/tokens.repository';

@Injectable()
export class TokensService {
  constructor(private readonly tokensRepository: TokensRepository) {}

  async saveToken(data: Omit<TokenDTO, 'blackListed'>) {
    return this.tokensRepository.save(data);
  }

  async findTokenByQuery(query: Partial<TokenDTO>) {
    return this.tokensRepository.findTokenByQuery(query);
  }

  async deleteAllTokens() {
    return this.tokensRepository.deleteAllTokens();
  }
}
