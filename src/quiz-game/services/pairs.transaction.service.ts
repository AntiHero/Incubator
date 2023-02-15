import { Injectable } from '@nestjs/common';
import { PlayerAnswerTransaction } from '../providers/pairs.transaction.provider';

@Injectable()
export class PairsTransactionService {
  public constructor(
    private readonly playerAnswerTransaction: PlayerAnswerTransaction,
  ) {}

  public async proceedAnswer(playerId: string, answer: string) {
    return this.playerAnswerTransaction.run({
      playerId,
      answer,
    });
  }
}
