import { MigrationInterface, QueryRunner } from 'typeorm';

export class Update1676403163692 implements MigrationInterface {
  name = 'Update1676403163692';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pairs" ALTER COLUMN "status" SET DEFAULT 'PendingSecondPlayer'`,
    );
    await queryRunner.query(
      `ALTER TABLE "security_devices" ALTER COLUMN "deviceId" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "security_devices" ALTER COLUMN "deviceId" SET DEFAULT gen_random_uuid()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "security_devices" ALTER COLUMN "deviceId" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "security_devices" ALTER COLUMN "deviceId" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "pairs" ALTER COLUMN "status" DROP DEFAULT`,
    );
  }
}
