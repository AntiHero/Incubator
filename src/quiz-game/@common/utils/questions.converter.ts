import { AnswerDTO, AnswerViewModel, QuestionDTO } from '../types';
import { Answer } from '../../infrastructure/database/entity/answer.entity';
import { Question } from '../../infrastructure/database/entity/question.entity';

export class QuestionsConverter {
  public static toDTO(question: Question): QuestionDTO {
    return {
      id: String(question.id),
      body: question.body,
      correctAnswers: question.correctAnswers,
      published: question.published,
      createdAt: question.createdAt.toISOString(),
      updatedAt: question.updatedAt.toISOString(),
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
