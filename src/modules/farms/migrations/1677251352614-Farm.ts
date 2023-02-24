import { MigrationInterface, QueryRunner } from "typeorm";

export class Farm1677251352614 implements MigrationInterface {
    public name = "Farm1677251352614"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "farm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "address" character varying, "coordinates" character varying, "size" integer NOT NULL, "cropYield" integer NOT NULL, CONSTRAINT "PK_3bf246b27a3b6678dfc0b7a3f64" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "farm"`);
    }

}
