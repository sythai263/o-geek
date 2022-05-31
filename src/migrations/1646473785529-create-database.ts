import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDatabase1646473785529 implements MigrationInterface {
    name = 'createDatabase1646473785529';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`SET TIMEZONE='${process.env.TIMEZONE}'`);
        await queryRunner.query(
            `CREATE TYPE "public"."user_role_enum" AS 
            ENUM('USER', 'PEOPLE_OPS')`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."read_status_enum" AS 
            ENUM('UNREAD', 'READ')`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."committed_workload_status_enum" AS 
            ENUM('INACTIVE', 'ACTIVE', 'INCOMING', 'NOT RENEW')`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."plan_status_enum" AS 
            ENUM('PLANNING', 'EXECUTING', 'CLOSED', 'ARCHIVE')`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."issue_status_enum" AS 
            ENUM('POTENTIAL ISSUE', 'RESOLVED')`,
        );
        await queryRunner.query(
            `CREATE TABLE "user" (
                "id" SERIAL NOT NULL,
                "alias" varchar(50) NOT NULL,
                "name" varchar(255) NOT NULL,
                "phone" varchar(15) NOT NULL,
                "email" varchar(255) NOT NULL,
                "avatar" character varying(500) NOT NULL,
                "role" "public"."user_role_enum" NOT NULL DEFAULT 'USER', 
                "created_by" integer,
                "updated_by" integer,
                "deleted_by" integer,
                "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMPTZ,
                CONSTRAINT "UQ_USER_ALIAS" UNIQUE ("alias"),
                CONSTRAINT "UQ_USER_PHONE" UNIQUE ("phone"),
                CONSTRAINT "UQ_USER_EMAIL" UNIQUE ("email"),
                CONSTRAINT "PK_USER" PRIMARY KEY ("id")
            )`,
        );
        await queryRunner.query(
            `CREATE TABLE "value_stream" (
                "id" SERIAL NOT NULL,
                "name" varchar(100) NOT NULL,
                "created_by" integer,
                "updated_by" integer,
                "deleted_by" integer,
                "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMPTZ,
                CONSTRAINT "PK_VALUE_STREAM" PRIMARY KEY ("id")
            )`,
        );
        await queryRunner.query(
            `CREATE TABLE "expertise_scope" (
                "id" SERIAL NOT NULL ,
                "name" character varying(100) NOT NULL,
                "created_by" integer,
                "updated_by" integer,
                "deleted_by" integer,
                "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMPTZ,
                CONSTRAINT "PK_EXPERTISE_SCOPE" PRIMARY KEY ("id")
            )`,
        );
        await queryRunner.query(
            `CREATE TABLE "contributed_value" (
                "id" SERIAL NOT NULL,
                "value_stream_id" integer,
                "expertise_scope_id" integer,
                "created_by" integer,
                "updated_by" integer,
                "deleted_by" integer,
                "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMPTZ,
                CONSTRAINT "PK_CONTRIBUTED_VALUE" PRIMARY KEY ("id"),
                CONSTRAINT "FK_CONTRIBUTED_VALUE_EXPERTISE_SCOPE" 
                    FOREIGN KEY ("expertise_scope_id") REFERENCES "expertise_scope"("id"),
                CONSTRAINT "FK_CONTRIBUTED_VALUE_VALUE_STREAM" 
                    FOREIGN KEY ("value_stream_id") REFERENCES "value_stream"("id")
            )`,
        );
        await queryRunner.query(
            `CREATE TABLE "committed_workload" (
                "id" SERIAL NOT NULL,
                "contributed_value_id" integer,
                "committed_workload" integer NOT NULL,
                "start_date" TIMESTAMPTZ NOT NULL,
                "expired_date" TIMESTAMPTZ NOT NULL,
                "user_id" integer,
                "status" "public"."committed_workload_status_enum" NOT NULL DEFAULT 'INCOMING',
                "created_by" integer,
                "updated_by" integer,
                "deleted_by" integer,
                "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMPTZ,
                CONSTRAINT "PK_COMMITTED_WORKLOAD" PRIMARY KEY ("id"),
                CONSTRAINT "FK_COMMITTED_WORKLOAD_USER" 
                    FOREIGN KEY ("user_id") REFERENCES "user"("id"),
                CONSTRAINT "FK_COMMITTED_WORKLOAD_CONTRIBUTED_VALUE" 
                    FOREIGN KEY ("contributed_value_id") REFERENCES "contributed_value"("id"),
                CONSTRAINT "CHK_START_DATE_COMMITTED_WORKLOAD" 
                    CHECK("start_date" < "expired_date"),
                CONSTRAINT "CHK_COMMITTED_WORKLOAD" 
                    CHECK("committed_workload" >=0)
            )`,
        );
        await queryRunner.query(
            `CREATE TABLE "planned_workload" (
                "id" SERIAL NOT NULL,
                "planned_workload" decimal(4,2) NOT NULL,
                "start_date" TIMESTAMPTZ NOT NULL,
                "user_id" integer,
                "contributed_value_id" integer,
                "committed_workload_id" integer,
                "status" "public"."plan_status_enum" DEFAULT 'PLANNING',
                "reason" text NOT NULL,
                "created_by" integer,
                "updated_by" integer,
                "deleted_by" integer,
                "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMPTZ,
                CONSTRAINT "PK_PLANNED_WORKLOAD" PRIMARY KEY ("id"),
                CONSTRAINT "FK_PLANNED_WORKLOAD_CONTRIBUTED_VALUE" 
                    FOREIGN KEY ("contributed_value_id") REFERENCES "contributed_value"("id"),
                CONSTRAINT "FK_PLANNED_WORKLOAD_USER" 
                    FOREIGN KEY ("user_id") REFERENCES "user"("id"),
                CONSTRAINT "FK_PLANNED_WORKLOAD_COMMITTED_WORKLOAD" 
                    FOREIGN KEY ("committed_workload_id") REFERENCES "committed_workload"("id"),
                CONSTRAINT "CHK_PLANNED_WORKLOAD" 
                    CHECK("planned_workload" >= 0)
            )`,
        );
        await queryRunner.query(
            `CREATE TABLE "issue" (
                "id" SERIAL NOT NULL, 
                "status" "public"."issue_status_enum" NULL, 
                "note" text NULL,
                "first_date_of_week" TIMESTAMPTZ NOT NULL,
                "user_id" integer, 
                "created_by" integer,
                "updated_by" integer,
                "deleted_by" integer,
                "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMPTZ,
                CONSTRAINT "PK_ISSUE" PRIMARY KEY ("id"),
                CONSTRAINT "FK_ISSUE_DELETED_BY" 
                    FOREIGN KEY ("deleted_by") REFERENCES "user"("id")
                )`,
        );
        await queryRunner.query(
            `CREATE TABLE "notification" (
                "id" SERIAL NOT NULL, 
                "message" text NOT NULL, 
                "read" "public"."read_status_enum" NOT NULL DEFAULT 'UNREAD',
                "user_id" integer, 
                "created_by" integer,
                "updated_by" integer,
                "deleted_by" integer,
                "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMPTZ,
                CONSTRAINT "PK_NOTIFICATION" PRIMARY KEY ("id"),
                CONSTRAINT "FK_NOTIFICATION_USER" 
                    FOREIGN KEY ("user_id") REFERENCES "user"("id")
            )`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "notification"');
        await queryRunner.query('DROP TABLE "issue"');
        await queryRunner.query('DROP TABLE "planned_workload"');
        await queryRunner.query('DROP TABLE "committed_workload"');
        await queryRunner.query('DROP TABLE "contributed_value"');
        await queryRunner.query('DROP TABLE "expertise_scope"');
        await queryRunner.query('DROP TABLE "value_stream"');
        await queryRunner.query('DROP TABLE "user"');
        await queryRunner.query('DROP TYPE "public"."issue_status_enum"');
        await queryRunner.query('DROP TYPE "public"."plan_status_enum"');
        await queryRunner.query('DROP TYPE "public"."read_status_enum"');
        await queryRunner.query('DROP TYPE "public"."user_role_enum"');
        await queryRunner.query(
            'DROP TYPE "public"."committed_workload_status_enum"',
        );
    }
}
