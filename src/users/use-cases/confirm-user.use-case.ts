import { Injectable } from '@nestjs/common';

import { ConfirmationInfoSqlRepository } from '../adapter/user-confirmation-info-sql.adapter';

@Injectable()
export class ConfirmUserUseCase {
  constructor(
    private readonly confirmUserRepository: ConfirmationInfoSqlRepository,
  ) {}

  async execute(id: string) {
    return this.confirmUserRepository.confirmUser(id);
  }
}
