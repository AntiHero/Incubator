import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column({ type: 'timestamptz' })
  expDate: Date;

  @Column({ type: 'boolean', default: true })
  blackListed: boolean;
}
