import { Answer } from '../../infrastructure/database/entity/answer.entity';
import { AnswerDTO, AnswerViewModel } from '../types';

export class AnswersConverter {
  public static toDTO(answer: Answer): AnswerDTO {
    return {
      gameId: String(answer.pairGame.id),
      playerId: String(answer.player.id),
      answerStatus: answer.answerStatus,
      addedAt: answer.addedAt.toISOString(),
      questionId: answer.question?.id.toString() ?? null,
    };
  }

  public static toView(answer: AnswerDTO): AnswerViewModel {
    return {
      addedAt: answer.addedAt,
      questionId: answer.questionId,
      answerStatus: answer.answerStatus,
    };
  }
}
