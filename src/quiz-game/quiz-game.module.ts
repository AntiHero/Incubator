import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Question } from './entity/question.entity';
import { QuestionsService } from './questions.service';
import { QuizGameController } from './quiz-game.controller';
import { QuestionsProvider } from './repository/questions.repo';
import { QuestionsQueryProvider } from './repository/questions.query-repo';

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  providers: [QuestionsProvider, QuestionsQueryProvider, QuestionsService],
  controllers: [QuizGameController],
})
export class QuizGameModule {}
