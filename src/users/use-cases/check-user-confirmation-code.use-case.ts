import { Injectable } from '@nestjs/common';

import { ConfirmationInfoSqlRepository } from '../adapter/user-confirmation-info-sql.adapter';

@Injectable()
export class CheckUserConfirmationCodeUseCase {
  constructor(
    private readonly confirmUserRepository: ConfirmationInfoSqlRepository,
  ) {}

  async execute(code: string) {
    return this.confirmUserRepository.checkUserConfirmationCode(code);
  }
}
