import { Field, ID, ObjectType } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity } from "typeorm";

@ObjectType()
@Entity()
export class Story extends BaseEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column({
        length: 100
    })
    productName: string;

    @Field()
    @Column("text")
    title: string;

    @Field()
    @Column('text')
    description: string

    @Field()
    @Column({ default: 0 })
    upvotes: number

    @Column({ default: 0 })
    reports: number

    @Field()
    @CreateDateColumn()
    created_at: Date

    @Field()
    @UpdateDateColumn()
    updated_at: Date

    @Field()
    @Column('smallint', { default: 0 })
    reads: number

}