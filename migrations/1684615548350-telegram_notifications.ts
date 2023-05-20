import { MigrationInterface, QueryRunner } from 'typeorm';

export class telegramNotifications1684615548350 implements MigrationInterface {
  name = 'telegramNotifications1684615548350';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "telegram_notifications" DROP CONSTRAINT "FK_5e73bd3a99e3cca5f24906aa795"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telegram_notifications" RENAME COLUMN "subscrptionId" TO "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telegram_notifications" RENAME CONSTRAINT "UQ_5e73bd3a99e3cca5f24906aa795" TO "UQ_3300adc8b3035dd3e90efa70aa2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telegram_notifications" ALTER COLUMN "code" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "telegram_notifications" ALTER COLUMN "code" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "security_devices" ALTER COLUMN "deviceId" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "security_devices" ALTER COLUMN "deviceId" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "telegram_notifications" ADD CONSTRAINT "FK_3300adc8b3035dd3e90efa70aa2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "telegram_notifications" DROP CONSTRAINT "FK_3300adc8b3035dd3e90efa70aa2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security_devices" ALTER COLUMN "deviceId" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "security_devices" ALTER COLUMN "deviceId" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "telegram_notifications" ALTER COLUMN "code" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "telegram_notifications" ALTER COLUMN "code" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "telegram_notifications" RENAME CONSTRAINT "UQ_3300adc8b3035dd3e90efa70aa2" TO "UQ_5e73bd3a99e3cca5f24906aa795"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telegram_notifications" RENAME COLUMN "userId" TO "subscrptionId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "telegram_notifications" ADD CONSTRAINT "FK_5e73bd3a99e3cca5f24906aa795" FOREIGN KEY ("subscrptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
