import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Answer } from './entity/answer.entity';
import { PairGame } from './entity/pairs.entity';
import { Question } from './entity/question.entity';
import { UsersModule } from 'root/users/users.module';
import { PairsService } from './services/pairs.service';
import { AnswersService } from './services/answers.service';
import { QuestionsService } from './services/questions.service';
import { PairsController } from './controllers/pairs.controller';
import { QuizQuestionsController } from './controllers/questions.controller';
import { PairsTransactionService } from './services/pairs.transaction.service';
import { PlayerAnswerTransaction } from './providers/pairs.transaction.provider';
import { serviceProviderFactory } from 'root/@common/utils/serviceProviderFactory';
import { AnswersRepository } from './infrastructure/repositories/answers.repository';
import { QuestionsProvider } from './infrastructure/repositories/questions.repository';
import { AnswersQueryRepository } from './infrastructure/repositories/answers.query.repository';
import { QuestionsQueryProvider } from './infrastructure/repositories/questions.query.repository';
import { PairsRepository } from 'root/quiz-game/infrastructure/repositories/pairs.repository';
import { PairsQueryRepository } from 'root/quiz-game/infrastructure/repositories/pairs.query.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, PairGame, Answer]),
    UsersModule,
  ],
  providers: [
    PairsService,
    AnswersService,
    PairsRepository,
    QuestionsService,
    AnswersRepository,
    QuestionsProvider,
    PairsQueryRepository,
    QuestionsQueryProvider,
    AnswersQueryRepository,
    PlayerAnswerTransaction,
    serviceProviderFactory(PairsTransactionService),
  ],
  controllers: [QuizQuestionsController, PairsController],
  exports: [QuestionsService, PairsService],
})
export class QuizGameModule {}
