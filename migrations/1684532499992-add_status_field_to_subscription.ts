import { MigrationInterface, QueryRunner } from 'typeorm';

export class addStatusFieldToSubscription1684532499992
  implements MigrationInterface
{
  name = 'addStatusFieldToSubscription1684532499992';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."subscription_status_enum" AS ENUM('None', 'Subscribed', 'Unsubscribed')`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" ADD "status" "public"."subscription_status_enum" NOT NULL DEFAULT 'Subscribed'`,
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
    await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."subscription_status_enum"`);
  }
}
