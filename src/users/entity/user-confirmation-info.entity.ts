import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_confirmation_info')
export class UserConfirmationInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint' })
  expDate: number;

  @Column()
  @Generated('uuid')
  code: string;

  @Column({ type: 'boolean', default: false })
  isConfirmed: boolean;
}
