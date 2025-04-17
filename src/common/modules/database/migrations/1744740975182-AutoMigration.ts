import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1744740975182 implements MigrationInterface {
    name = 'AutoMigration1744740975182'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "task" DROP CONSTRAINT "FK_a132ba8200c3abdc271d4a701d8"
        `);
        await queryRunner.query(`
            CREATE TABLE "project_users" (
                "projectId" integer NOT NULL,
                "userId" integer NOT NULL,
                CONSTRAINT "PK_180c5df4197aae759c30784f7e1" PRIMARY KEY ("projectId", "userId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_1905d9d76173d09c07ba1f0cd8" ON "project_users" ("projectId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_6ebc83af455ff1ed9573c823e2" ON "project_users" ("userId")
        `);
        await queryRunner.query(`
            CREATE TABLE "task_assignees" (
                "taskId" integer NOT NULL,
                "userId" integer NOT NULL,
                CONSTRAINT "PK_296ec87b94a488aea22063f7f3e" PRIMARY KEY ("taskId", "userId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_8b1600551063c485554bca74c1" ON "task_assignees" ("taskId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_e1f7dbf3fd1b02451882ea7c7b" ON "task_assignees" ("userId")
        `);
        await queryRunner.query(`
            ALTER TABLE "project" DROP COLUMN "text"
        `);
        await queryRunner.query(`
            ALTER TABLE "project" DROP COLUMN "done"
        `);
        await queryRunner.query(`
            ALTER TABLE "task" DROP COLUMN "text"
        `);
        await queryRunner.query(`
            ALTER TABLE "task" DROP COLUMN "done"
        `);
        await queryRunner.query(`
            ALTER TABLE "task" DROP COLUMN "ownerId"
        `);
        await queryRunner.query(`
            ALTER TABLE "project"
            ADD "name" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "project"
            ADD "description" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "project"
            ADD "isArchived" boolean NOT NULL DEFAULT false
        `);
        await queryRunner.query(`
            ALTER TABLE "project"
            ADD "deletedAt" TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE "task"
            ADD "name" character varying NOT NULL
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."task_status_enum" AS ENUM('pending', 'in_progress', 'completed')
        `);
        await queryRunner.query(`
            ALTER TABLE "task"
            ADD "status" "public"."task_status_enum" NOT NULL DEFAULT 'pending'
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."task_priority_enum" AS ENUM('low', 'medium', 'high')
        `);
        await queryRunner.query(`
            ALTER TABLE "task"
            ADD "priority" "public"."task_priority_enum" NOT NULL DEFAULT 'medium'
        `);
        await queryRunner.query(`
            ALTER TABLE "task"
            ADD "deletedAt" TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE "task"
            ADD "projectId" integer NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "task"
            ADD CONSTRAINT "FK_3797a20ef5553ae87af126bc2fe" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "project_users"
            ADD CONSTRAINT "FK_1905d9d76173d09c07ba1f0cd84" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "project_users"
            ADD CONSTRAINT "FK_6ebc83af455ff1ed9573c823e23" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "task_assignees"
            ADD CONSTRAINT "FK_8b1600551063c485554bca74c13" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "task_assignees"
            ADD CONSTRAINT "FK_e1f7dbf3fd1b02451882ea7c7b4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "task_assignees" DROP CONSTRAINT "FK_e1f7dbf3fd1b02451882ea7c7b4"
        `);
        await queryRunner.query(`
            ALTER TABLE "task_assignees" DROP CONSTRAINT "FK_8b1600551063c485554bca74c13"
        `);
        await queryRunner.query(`
            ALTER TABLE "project_users" DROP CONSTRAINT "FK_6ebc83af455ff1ed9573c823e23"
        `);
        await queryRunner.query(`
            ALTER TABLE "project_users" DROP CONSTRAINT "FK_1905d9d76173d09c07ba1f0cd84"
        `);
        await queryRunner.query(`
            ALTER TABLE "task" DROP CONSTRAINT "FK_3797a20ef5553ae87af126bc2fe"
        `);
        await queryRunner.query(`
            ALTER TABLE "task" DROP COLUMN "projectId"
        `);
        await queryRunner.query(`
            ALTER TABLE "task" DROP COLUMN "deletedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "task" DROP COLUMN "priority"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."task_priority_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "task" DROP COLUMN "status"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."task_status_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "task" DROP COLUMN "name"
        `);
        await queryRunner.query(`
            ALTER TABLE "project" DROP COLUMN "deletedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "project" DROP COLUMN "isArchived"
        `);
        await queryRunner.query(`
            ALTER TABLE "project" DROP COLUMN "description"
        `);
        await queryRunner.query(`
            ALTER TABLE "project" DROP COLUMN "name"
        `);
        await queryRunner.query(`
            ALTER TABLE "task"
            ADD "ownerId" integer NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "task"
            ADD "done" boolean NOT NULL DEFAULT false
        `);
        await queryRunner.query(`
            ALTER TABLE "task"
            ADD "text" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "project"
            ADD "done" boolean NOT NULL DEFAULT false
        `);
        await queryRunner.query(`
            ALTER TABLE "project"
            ADD "text" character varying NOT NULL
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_e1f7dbf3fd1b02451882ea7c7b"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_8b1600551063c485554bca74c1"
        `);
        await queryRunner.query(`
            DROP TABLE "task_assignees"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_6ebc83af455ff1ed9573c823e2"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_1905d9d76173d09c07ba1f0cd8"
        `);
        await queryRunner.query(`
            DROP TABLE "project_users"
        `);
        await queryRunner.query(`
            ALTER TABLE "task"
            ADD CONSTRAINT "FK_a132ba8200c3abdc271d4a701d8" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
    }

}
