import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  EntityManager,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { PairGame } from './pairs.entity';
import { AnswerStatuses } from '../types/enum';
import { User } from 'root/users/entity/user.entity';
import { AnswerDTO, AnswerViewModel } from '../types';
import { Question } from 'root/quiz-game/entity/question.entity';

@Entity('answers', {
  orderBy: {
    addedAt: 'ASC',
  },
})
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((_) => PairGame, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pairGameId' })
  pairGame: PairGame;

  @ManyToOne((_) => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'playerId' })
  player: User;

  @ManyToOne((_) => Question, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @Column({ type: 'enum', enum: AnswerStatuses, nullable: true })
  answerStatus: AnswerStatuses;

  @CreateDateColumn()
  addedAt: Date;

  public static create(body: Omit<Partial<Answer>, 'id'>) {
    const answer = new Answer();

    Object.assign(answer, body);

    return answer;
  }

  public static createWrongAnswer({
    pairGame,
    player,
  }: {
    pairGame: PairGame;
    player: User;
  }) {
    const answer = new Answer();
    answer.addedAt = new Date();
    answer.answerStatus = AnswerStatuses.incorrect;
    answer.pairGame = pairGame;
    answer.player = player;
  }

  public toDTO(): AnswerDTO {
    return {
      gameId: String(this.pairGame.id),
      playerId: String(this.player.id),
      answerStatus: this.answerStatus,
      addedAt: this.addedAt.toISOString(),
      questionId: this.question?.id.toString() ?? null,
    };
  }

  public toView(): AnswerViewModel {
    return {
      questionId: String(this.question.id),
      answerStatus: this.answerStatus,
      addedAt: this.addedAt.toISOString(),
    };
  }
}
