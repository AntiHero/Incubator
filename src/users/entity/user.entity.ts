import {
  Column,
  Entity,
  OneToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';
import bcrypt from 'bcrypt';

import { Roles } from 'root/users/types/roles';
import { UserBanInfo } from './user-ban-info.entity';
import { PasswordRecovery } from './password-recovery.entity';
import { fiveMinInMs, saltRounds } from 'root/@common/constants';
import { UserConfirmationInfo } from './user-confirmation-info.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login: string;

  @Column({ unique: true })
  email: string;

  @OneToOne(() => UserBanInfo)
  userBanInfo: UserBanInfo;

  @OneToOne(() => PasswordRecovery)
  passwordRecovery: PasswordRecovery;

  @OneToOne(() => UserConfirmationInfo)
  userConfirmationInfo: UserConfirmationInfo;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: Roles, default: Roles.USER })
  role: Roles;

  @CreateDateColumn()
  createdAt: Date;

  static async createUser(userData: Partial<Omit<User, 'id'>>) {
    try {
      const user = new User();

      user.login = userData.login;
      user.email = userData.email;
      user.password = await bcrypt.hash(userData.password, saltRounds);

      const savedUser = (
        await this.createQueryBuilder()
          .insert()
          .into(User)
          .values([user])
          .returning('*')
          .execute()
      )?.raw[0];

      const userBanInfo = new UserBanInfo();
      userBanInfo.userId = <User>{ id: savedUser.id };

      await this.createQueryBuilder()
        .insert()
        .into(UserBanInfo)
        .values([userBanInfo])
        .execute();

      const passwordRecovery = new PasswordRecovery();
      passwordRecovery.userId = <User>{ id: savedUser.id };

      await this.createQueryBuilder()
        .insert()
        .into(PasswordRecovery)
        .values([passwordRecovery])
        .execute();

      const userConfirmationInfo = new UserConfirmationInfo();
      userConfirmationInfo.userId = <User>{ id: savedUser.id };
      userConfirmationInfo.expDate = Date.now() + fiveMinInMs;

      await this.createQueryBuilder()
        .insert()
        .into(UserConfirmationInfo)
        .values([userConfirmationInfo])
        .execute();

      return savedUser;
    } catch (err) {
      console.log(err);

      return null;
    }
  }
}
