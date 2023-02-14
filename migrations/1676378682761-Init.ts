import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1676378682761 implements MigrationInterface {
  name = 'Init1676378682761';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('SUPER_ADMIN', 'USER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "login" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blogs" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "websiteUrl" character varying NOT NULL, "banInfo" text NOT NULL DEFAULT '{ "banDate": null, "isBanned": false }', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_e113335f11c926da929a625f118" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "posts" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "content" character varying NOT NULL, "shortDescription" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "blogId" integer, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "comments" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "isBanned" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "entityId" integer, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."post_likes_likestatus_enum" AS ENUM('None', 'Like', 'Dislike')`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_likes" ("id" SERIAL NOT NULL, "likeStatus" "public"."post_likes_likestatus_enum" NOT NULL DEFAULT 'None', "isBanned" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "entityId" integer, "userId" integer, CONSTRAINT "PK_e4ac7cb9daf243939c6eabb2e0d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."comment_likes_likestatus_enum" AS ENUM('None', 'Like', 'Dislike')`,
    );
    await queryRunner.query(
      `CREATE TABLE "comment_likes" ("id" SERIAL NOT NULL, "likeStatus" "public"."comment_likes_likestatus_enum" NOT NULL DEFAULT 'None', "isBanned" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "entityId" integer, "userId" integer, CONSTRAINT "PK_2c299aaf1f903c45ee7e6c7b419" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "banned_users" ("id" SERIAL NOT NULL, "banReason" character varying, "isBanned" boolean NOT NULL, "banDate" TIMESTAMP WITH TIME ZONE NOT NULL, "userId" integer, "entityId" integer, CONSTRAINT "REL_6fa8e5faa72487914dcd9ebb1e" UNIQUE ("userId"), CONSTRAINT "PK_51d2f075cd1f44def51dba2a96a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "questions" ("id" SERIAL NOT NULL, "body" character varying(500), "correctAnswers" jsonb NOT NULL, "published" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pairs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstPlayerScore" integer NOT NULL DEFAULT '0', "secondPlayerScore" integer NOT NULL DEFAULT '0', "questions" jsonb NOT NULL DEFAULT '[]', "firstPlayerAnswers" jsonb NOT NULL DEFAULT '[]', "secondPlayerAnswers" jsonb NOT NULL DEFAULT '[]', "status" character varying, "pairCreatedDate" TIMESTAMP NOT NULL DEFAULT now(), "startGameDate" TIMESTAMP WITH TIME ZONE, "finishGameDate" TIMESTAMP WITH TIME ZONE, "firstPlayerId" integer, "secondPlayerId" integer, CONSTRAINT "PK_bfc550b07b52c37db12aa7d8e69" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."answers_answerstatus_enum" AS ENUM('Correct', 'Incorrect')`,
    );
    await queryRunner.query(
      `CREATE TABLE "answers" ("id" SERIAL NOT NULL, "answerStatus" "public"."answers_answerstatus_enum", "addedAt" TIMESTAMP NOT NULL DEFAULT now(), "pairGameId" uuid, "playerId" integer, "questionId" integer, CONSTRAINT "PK_9c32cec6c71e06da0254f2226c6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "security_devices" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "ip" character varying NOT NULL, "deviceId" uuid NOT NULL DEFAULT gen_random_uuid(), "lastActiveDate" TIMESTAMP WITH TIME ZONE NOT NULL, "userId" integer, CONSTRAINT "PK_1a2707b89afb452a5ca4e6c8883" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tokens" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "expDate" TIMESTAMP WITH TIME ZONE NOT NULL, "blackListed" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "password_recovery" ("id" SERIAL NOT NULL, "code" uuid, "userId" integer, CONSTRAINT "REL_f5b57d414cf38032bbbe9ec578" UNIQUE ("userId"), CONSTRAINT "PK_104b7650227e31deb0f4c9e7d4b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users_ban_info" ("id" SERIAL NOT NULL, "banDate" TIMESTAMP WITH TIME ZONE, "banReason" character varying, "isBanned" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "REL_7b1daa25d1084a7fe6beaad1ff" UNIQUE ("userId"), CONSTRAINT "PK_8e98cde5d735710f0651c446641" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users_confirmation_info" ("id" SERIAL NOT NULL, "expDate" bigint NOT NULL, "code" uuid NOT NULL DEFAULT uuid_generate_v4(), "isConfirmed" boolean NOT NULL DEFAULT false, "userId" integer, CONSTRAINT "REL_b67b61c4b505f45ea12d68c419" UNIQUE ("userId"), CONSTRAINT "PK_df530943d256adfc16b59227df1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "blogs" ADD CONSTRAINT "FK_50205032574e0b039d655f6cfd3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_55d9c167993fed3f375391c8e31" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_d7044ee71afa7fa721de0e3de76" FOREIGN KEY ("entityId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_likes" ADD CONSTRAINT "FK_582f099c5e8e6cf9599c9200394" FOREIGN KEY ("entityId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_likes" ADD CONSTRAINT "FK_37d337ad54b1aa6b9a44415a498" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_likes" ADD CONSTRAINT "FK_498bb008ec5f41a09f1c550cf1f" FOREIGN KEY ("entityId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_likes" ADD CONSTRAINT "FK_34d1f902a8a527dbc2502f87c88" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "banned_users" ADD CONSTRAINT "FK_6fa8e5faa72487914dcd9ebb1e7" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "banned_users" ADD CONSTRAINT "FK_481aa49a10a1968671d7d9c0c22" FOREIGN KEY ("entityId") REFERENCES "blogs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pairs" ADD CONSTRAINT "FK_849300816bfe69bc1b556eeb176" FOREIGN KEY ("firstPlayerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pairs" ADD CONSTRAINT "FK_ce6f1c246a38804ade843e07580" FOREIGN KEY ("secondPlayerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "answers" ADD CONSTRAINT "FK_aa6a4b32f4b4d5d9109e0c0979e" FOREIGN KEY ("pairGameId") REFERENCES "pairs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "answers" ADD CONSTRAINT "FK_2db19a3852a73462e7532965c82" FOREIGN KEY ("playerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "answers" ADD CONSTRAINT "FK_c38697a57844f52584abdb878d7" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "security_devices" ADD CONSTRAINT "FK_d64e3882d0746fe780449237461" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "password_recovery" ADD CONSTRAINT "FK_f5b57d414cf38032bbbe9ec578d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_ban_info" ADD CONSTRAINT "FK_7b1daa25d1084a7fe6beaad1ff4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_confirmation_info" ADD CONSTRAINT "FK_b67b61c4b505f45ea12d68c419d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_confirmation_info" DROP CONSTRAINT "FK_b67b61c4b505f45ea12d68c419d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_ban_info" DROP CONSTRAINT "FK_7b1daa25d1084a7fe6beaad1ff4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "password_recovery" DROP CONSTRAINT "FK_f5b57d414cf38032bbbe9ec578d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security_devices" DROP CONSTRAINT "FK_d64e3882d0746fe780449237461"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answers" DROP CONSTRAINT "FK_c38697a57844f52584abdb878d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answers" DROP CONSTRAINT "FK_2db19a3852a73462e7532965c82"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answers" DROP CONSTRAINT "FK_aa6a4b32f4b4d5d9109e0c0979e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pairs" DROP CONSTRAINT "FK_ce6f1c246a38804ade843e07580"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pairs" DROP CONSTRAINT "FK_849300816bfe69bc1b556eeb176"`,
    );
    await queryRunner.query(
      `ALTER TABLE "banned_users" DROP CONSTRAINT "FK_481aa49a10a1968671d7d9c0c22"`,
    );
    await queryRunner.query(
      `ALTER TABLE "banned_users" DROP CONSTRAINT "FK_6fa8e5faa72487914dcd9ebb1e7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_likes" DROP CONSTRAINT "FK_34d1f902a8a527dbc2502f87c88"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_likes" DROP CONSTRAINT "FK_498bb008ec5f41a09f1c550cf1f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_likes" DROP CONSTRAINT "FK_37d337ad54b1aa6b9a44415a498"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_likes" DROP CONSTRAINT "FK_582f099c5e8e6cf9599c9200394"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_d7044ee71afa7fa721de0e3de76"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749"`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_55d9c167993fed3f375391c8e31"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blogs" DROP CONSTRAINT "FK_50205032574e0b039d655f6cfd3"`,
    );
    await queryRunner.query(`DROP TABLE "users_confirmation_info"`);
    await queryRunner.query(`DROP TABLE "users_ban_info"`);
    await queryRunner.query(`DROP TABLE "password_recovery"`);
    await queryRunner.query(`DROP TABLE "tokens"`);
    await queryRunner.query(`DROP TABLE "security_devices"`);
    await queryRunner.query(`DROP TABLE "answers"`);
    await queryRunner.query(`DROP TYPE "public"."answers_answerstatus_enum"`);
    await queryRunner.query(`DROP TABLE "pairs"`);
    await queryRunner.query(`DROP TABLE "questions"`);
    await queryRunner.query(`DROP TABLE "banned_users"`);
    await queryRunner.query(`DROP TABLE "comment_likes"`);
    await queryRunner.query(
      `DROP TYPE "public"."comment_likes_likestatus_enum"`,
    );
    await queryRunner.query(`DROP TABLE "post_likes"`);
    await queryRunner.query(`DROP TYPE "public"."post_likes_likestatus_enum"`);
    await queryRunner.query(`DROP TABLE "comments"`);
    await queryRunner.query(`DROP TABLE "posts"`);
    await queryRunner.query(`DROP TABLE "blogs"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
