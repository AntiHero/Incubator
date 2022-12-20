import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Token } from '../entity/token.entity';
import { TokenDTO } from '../types';

@Injectable()
export class TokensRepository {
  constructor(
    @InjectRepository(Token)
    private readonly tokensRepository: Repository<Token>,
  ) {}

  async save(tokenData: Omit<TokenDTO, 'blackListed'>) {
    try {
      const { token, expDate } = tokenData;

      await this.tokensRepository.query(
        `
        INSERT INTO tokens ("token", "expDate", "blackListed") 
          VALUES ($1, $2, DEFAULT) RETURNING *
      `,
        [token, expDate],
      );

      return true;
    } catch (e) {
      console.log(e);

      return null;
    }
  }

  async findTokenByQuery(query: Partial<TokenDTO>) {
    const { token, blackListed } = query;

    const tokenId = (
      await this.tokensRepository.query(
        `
        SELECT id FROM tokens WHERE "token"=$1, "blackListed"=$2 LIMIT 1
      `,
        [token, blackListed],
      )
    )[0]?.id;

    if (!tokenId) return null;

    return true;
  }

  async deleteAllTokens() {
    try {
      await this.tokensRepository.query(`DELETE FROM tokens`);
    } catch (error) {
      console.error(error);

      return null;
    }
  }
}
