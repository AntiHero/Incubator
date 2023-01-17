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

@Entity('answers')
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((_) => PairGame, (game) => game.answers, { onDelete: 'CASCADE' })
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

  public toDTO(): AnswerDTO {
    return {
      id: String(this.id),
      gameId: String(this.pairGame.id),
      playerId: String(this.player.id),
      questionId: this.question?.id.toString() ?? null,
      answerStatus: this.answerStatus,
      addedAt: this.addedAt.toISOString(),
    };
  }

  public static create(answerData: Omit<Partial<Answer>, 'id'>) {
    const answer = new Answer();

    Object.assign(answer, answerData);

    return answer;
  }

  public static async findById(id: number, manager: EntityManager) {
    const answer = await manager.findOne(Answer, {
      where: {
        id,
      },
      relations: {
        question: true,
      },
    });

    return answer;
  }

  public toView(): AnswerViewModel {
    return {
      questionId: String(this.question.id),
      answerStatus: this.answerStatus,
      addedAt: this.addedAt.toISOString(),
    };
  }
}
