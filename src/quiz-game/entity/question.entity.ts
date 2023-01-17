import {
  Column,
  Entity,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuestionDTO } from '../types';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, length: 500 })
  body: string;

  @Column({ type: 'jsonb' })
  correctAnswers: string[];

  @Column({ default: false })
  published: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date | null;

  toDTO(): QuestionDTO {
    return {
      id: String(this.id),
      body: this.body,
      published: this.published,
      correctAnswers: this.correctAnswers,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt?.toISOString() ?? null,
    };
  }
}
