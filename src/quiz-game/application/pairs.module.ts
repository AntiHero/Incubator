import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from 'root/users/users.module';
import { PairsService } from './services/pairs.service';
import { QuestionsService } from './services/questions.service';
import { PairsUserController } from './controllers/users.controller';
import { PairGame } from '../infrastructure/database/entity/pairs.entity';
import { PairsStatisticsService } from './services/game-statistics.service';
import { QuizQuestionsController } from './controllers/questions.controller';
import { Question } from '../infrastructure/database/entity/question.entity';
import { PairsTransactionService } from './services/pairs.transaction.service';
import { PlayerAnswerTransaction } from './providers/pairs.transaction.provider';
import { serviceProviderFactory } from 'root/@core/utils/serviceProviderFactory';
import { PairsController } from 'root/quiz-game/application/controllers/pairs.controller';
import { QuestionsProvider } from '../infrastructure/database/repositories/questions.repository';
import { FinishTheGameAfterDelayUseCase } from './use-cases/finish-the-game-after-delay.use-case-';
import { PairsRepository } from 'root/quiz-game/infrastructure/database/repositories/pairs.repository';
import { QuestionsQueryProvider } from '../infrastructure/database/repositories/questions.query.repository';
import { PairsQueryRepository } from 'root/quiz-game/infrastructure/database/repositories/pairs.query.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Question, PairGame]), UsersModule],
  providers: [
    PairsService,
    PairsRepository,
    QuestionsService,
    QuestionsProvider,
    PairsQueryRepository,
    QuestionsQueryProvider,
    PairsStatisticsService,
    PlayerAnswerTransaction,
    FinishTheGameAfterDelayUseCase,
    serviceProviderFactory(PairsTransactionService),
  ],
  controllers: [QuizQuestionsController, PairsController, PairsUserController],
  exports: [QuestionsService, PairsService],
})
export class QuizGameModule {}
