import { Injectable } from '@nestjs/common';

import { AnswersRepository } from '../../infrastructure/database/repositories/answers.repository';

@Injectable()
export class AnswersService {
  public constructor(private readonly answersRepository: AnswersRepository) {}

  public async deleteAllAnswers() {
    return this.answersRepository.deleteAllAnswers();
  }
}
