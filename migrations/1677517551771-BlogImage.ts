import { MigrationInterface, QueryRunner } from 'typeorm';

export class BlogImage1677517551771 implements MigrationInterface {
  name = 'BlogImage1677517551771';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."blog_images_type_enum" AS ENUM('wallpaper', 'main')`,
    );
    await queryRunner.query(
      `CREATE TABLE "blog_images" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "type" "public"."blog_images_type_enum" NOT NULL, "height" integer NOT NULL, "url" character varying, "width" integer NOT NULL, "size" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "blogId" integer, CONSTRAINT "PK_6d0e82081d480edf74e548575f4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "security_devices" ALTER COLUMN "deviceId" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "security_devices" ALTER COLUMN "deviceId" SET DEFAULT uuid_generate_v4()`,
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
      `ALTER TABLE "security_devices" ALTER COLUMN "deviceId" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "security_devices" ALTER COLUMN "deviceId" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(`DROP TABLE "blog_images"`);
    await queryRunner.query(`DROP TYPE "public"."blog_images_type_enum"`);
  }
}
