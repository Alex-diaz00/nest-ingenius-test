import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1744742065700 implements MigrationInterface {
    name = 'AutoMigration1744742065700'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "deletedAt" TIMESTAMP
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "deletedAt"
        `);
    }

}
