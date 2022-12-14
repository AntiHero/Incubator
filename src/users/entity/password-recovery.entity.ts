import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('password_recovery')
export class PasswordRecovery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', nullable: true })
  code: string;
}
