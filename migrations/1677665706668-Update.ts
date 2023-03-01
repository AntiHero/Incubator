import { MigrationInterface, QueryRunner } from 'typeorm';

export class Update1677665706668 implements MigrationInterface {
  name = 'Update1677665706668';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "security_devices" ALTER COLUMN "deviceId" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "security_devices" ALTER COLUMN "deviceId" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_images" DROP CONSTRAINT "FK_f8170b9ab2fe99c4a8eb1d23751"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_images" ALTER COLUMN "blogId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_images" ADD CONSTRAINT "FK_f8170b9ab2fe99c4a8eb1d23751" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blog_images" DROP CONSTRAINT "FK_f8170b9ab2fe99c4a8eb1d23751"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_images" ALTER COLUMN "blogId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_images" ADD CONSTRAINT "FK_f8170b9ab2fe99c4a8eb1d23751" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "security_devices" ALTER COLUMN "deviceId" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "security_devices" ALTER COLUMN "deviceId" SET DEFAULT uuid_generate_v4()`,
    );
  }
}
