import { Injectable } from '@nestjs/common';

import { ConfirmationInfoSqlRepository } from '../adapter/user-confirmation-info-sql.adapter';

@Injectable()
export class GetUserByConfirmationCodeUseCase {
  constructor(
    private readonly confirmUserRepository: ConfirmationInfoSqlRepository,
  ) {}

  async execute(code: string) {
    return this.confirmUserRepository.findUserByConfirmationCode(code);
  }
}
