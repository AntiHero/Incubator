import { MigrationInterface, QueryRunner } from 'typeorm';

export class Update1677428708063 implements MigrationInterface {
  name = 'Update1677428708063';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blogs" ALTER COLUMN "isMembership" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "security_devices" ALTER COLUMN "deviceId" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "security_devices" ALTER COLUMN "deviceId" SET DEFAULT uuid_generate_v4()`,
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
      `ALTER TABLE "blogs" ALTER COLUMN "isMembership" SET DEFAULT true`,
    );
  }
}
