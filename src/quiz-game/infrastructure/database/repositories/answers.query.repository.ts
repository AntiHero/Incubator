import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Answer } from 'root/quiz-game/infrastructure/database/entity/answer.entity';

@Injectable()
export class AnswersQueryRepository {
  constructor(
    @InjectRepository(Answer)
    private readonly answersQueryRepository: Repository<Answer>,
  ) {}
}
