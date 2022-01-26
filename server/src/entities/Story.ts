import { Field, ID, ObjectType } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToOne, OneToMany } from "typeorm";
import { Upvote } from "./Upvotes";
import { User } from "./User";

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
    @Column()
    creatorId: number;

    @ManyToOne(() => User, user => user.stories)
    @Field()
    creator: User

    @OneToMany(() => Upvote, upvote => upvote.post)
    upvotes: Upvote[]

    @Column({ default: 0 })
    reports: number


    @Field()
    @Column('smallint', { default: 0 })
    reads: number

    @Field()
    @CreateDateColumn()
    created_at: Date

    @Field()
    @UpdateDateColumn()
    updated_at: Date
}