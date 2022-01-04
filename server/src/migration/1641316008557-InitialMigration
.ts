import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration
1641316008557 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
