import { Injectable } from '@nestjs/common';
import { PlayerAnswerTransaction } from '../providers/pairs.transaction.provider';

@Injectable()
export class PairsTransactionService {
  public constructor(
    private readonly playerAnswerTransaction: PlayerAnswerTransaction,
  ) {}

  public async proceedAnswer(
    playerId: string,
    answer: string,
    // answerOrder: number,
    // answersOrderObj: {
    //   [key: string]: number;
    // },
  ) {
    return this.playerAnswerTransaction.run({
      playerId,
      answer,
      // answerOrder,
      // answersOrderObj,
    });
  }
}
