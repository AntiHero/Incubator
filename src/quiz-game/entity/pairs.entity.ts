import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AnswerDTO, GamePairDTO, QuestionDTO } from '../types';
import { GameStatuses } from '../types/enum';
import { User } from 'root/users/entity/user.entity';

@Entity('pairs')
export class PairGame {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((_) => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  firstPlayer: User;

  @ManyToOne((_) => User, { nullable: true, eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  secondPlayer: User;

  @Column({ default: 0 })
  firstPlayerScore: number;

  @Column({ default: 0 })
  secondPlayerScore: number;

  @Column({ type: 'jsonb', default: [] })
  questions: QuestionDTO[];

  @Column({ type: 'jsonb', default: [] })
  firstPlayerAnswers: AnswerDTO[];

  @Column({ type: 'jsonb', default: [] })
  secondPlayerAnswers: AnswerDTO[];

  @Column({
    enum: GameStatuses,
    nullable: true,
    default: null,
  })
  status: GameStatuses;

  @CreateDateColumn()
  pairCreatedDate: Date;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  startGameDate: Date | null;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  finishGameDate: Date | null;

  public get questionsLength() {
    return this.questions.length;
  }

  public increasePlayerScore(playerId: number) {
    if (this.firstPlayer.id === playerId) {
      this.firstPlayerScore++;
    } else {
      this.secondPlayerScore++;
    }
  }

  public get isAnswerLast() {
    return (
      this.questionsLength * 2 ===
      this.firstPlayerAnswers.length + this.secondPlayerAnswers.length + 1
    );
  }

  public isPlayerFirst(playerId: number) {
    return this.firstPlayer.id === playerId;
  }

  public getCurrentQuestion(playerId: number) {
    if (this.isPlayerFirst(playerId)) {
      return this.questions[this.firstPlayerAnswers.length];
    } else {
      return this.questions[this.secondPlayerAnswers.length];
    }
  }

  public getPlayerScore(playerId: number) {
    if (playerId === this.firstPlayer.id) {
      return this.firstPlayerScore;
    } else {
      return this.secondPlayerScore;
    }
  }

  public isAnswerCorrect(answer: string, question: QuestionDTO) {
    return question.correctAnswers.includes(answer);
  }

  public toDTO(): GamePairDTO {
    return {
      id: String(this.id),
      firstPlayer: {
        id: this.firstPlayer?.id.toString() ?? null,
        login: this.firstPlayer?.login.toString() ?? null,
      },
      secondPlayer: {
        id: this.secondPlayer?.id.toString() ?? null,
        login: this.secondPlayer?.login.toString() ?? null,
      },
      status: this.status,
      questions: this.questions,
      firstPlayerScore: this.firstPlayerScore,
      secondPlayerScore: this.secondPlayerScore,
      firstPlayerAnswers: this.firstPlayerAnswers,
      secondPlayerAnswers: this.secondPlayerAnswers,
      pairCreatedDate: this.pairCreatedDate.toISOString(),
      startGameDate: this.startGameDate?.toISOString() ?? null,
      finishGameDate: this.finishGameDate?.toISOString() ?? null,
    };
  }
}
