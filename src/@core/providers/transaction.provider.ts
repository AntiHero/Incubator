import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';

@Injectable()
export abstract class BaseTransactionProvider<T, U> {
  constructor(private readonly dataSource: DataSource) {}

  protected abstract execute(data: T, manager: EntityManager): Promise<U>;

  private async createRunner(): Promise<QueryRunner> {
    return this.dataSource.createQueryRunner();
  }

  public async run(data: T) {
    const queryRunner = await this.createRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { manager } = queryRunner;

    try {
      const result = await this.execute(data, manager);

      await queryRunner.commitTransaction();

      return result;
    } catch (e) {
      console.log(e);

      await queryRunner.rollbackTransaction();

      return null;
    } finally {
      await queryRunner.release();
    }
  }
}
