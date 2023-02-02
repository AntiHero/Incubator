import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PairGame } from './entity/pairs.entity';
import { Question } from './entity/question.entity';
import { PairsController } from './pairs.controller';
import { UsersModule } from 'root/users/users.module';
import { PairsService } from './services/pairs.service';
import { QuestionsService } from './services/questions.service';
import { QuizQuestionsController } from './controllers/questions.controller';
import { PairsTransactionService } from './services/pairs.transaction.service';
import { PlayerAnswerTransaction } from './providers/pairs.transaction.provider';
import { serviceProviderFactory } from 'root/@common/utils/serviceProviderFactory';
import { QuestionsProvider } from './infrastructure/repositories/questions.repository';
import { PairsRepository } from 'root/quiz-game/infrastructure/repositories/pairs.repository';
import { QuestionsQueryProvider } from './infrastructure/repositories/questions.query.repository';
import { PairsQueryRepository } from 'root/quiz-game/infrastructure/repositories/pairs.query.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Question, PairGame]), UsersModule],
  providers: [
    PairsService,
    PairsRepository,
    QuestionsService,
    QuestionsProvider,
    PairsQueryRepository,
    QuestionsQueryProvider,
    PlayerAnswerTransaction,
    serviceProviderFactory(PairsTransactionService),
  ],
  controllers: [QuizQuestionsController, PairsController],
  exports: [QuestionsService, PairsService],
})
export class QuizGameModule {}
