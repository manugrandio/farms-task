import { MigrationInterface, QueryRunner } from "typeorm";

export class FarmCreatedAt1677615406532 implements MigrationInterface {
    public name = "FarmCreatedAt1677615406532"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "farm" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "farm" DROP COLUMN "createdAt"`);
    }

}
