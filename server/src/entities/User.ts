import { Field } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string

    @Column("text", { unique: true })
    email: string

    @Column('bool', { default: false })
    is_activated: boolean

    @Field()
    @CreateDateColumn()
    created_at: Date

    @Field()
    @UpdateDateColumn()
    updated_at: Date

}