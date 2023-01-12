import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { User } from 'root/users/entity/user.entity';

@ValidatorConstraint({ name: 'ValiadteRecoveryCode', async: true })
@Injectable()
export class ValidateRecoveryCode implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async validate(value: string) {
    try {
      const id = (
        await this.usersRepository
          .createQueryBuilder('u')
          .select('id')
          .where(
            'u."id" = (SELECT "userId" FROM password_recovery WHERE code = :code)',
            { code: value },
          )
          .execute()
      )[0]?.id;

      return id ? true : false;
    } catch (e) {
      console.log('error');

      return false;
    }
  }

  defaultMessage() {
    return 'UUID code is not valid';
  }
}
