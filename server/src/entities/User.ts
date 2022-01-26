import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Story } from "./Story";
import { Upvote } from "./Upvotes";

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({ nullable: false })
    username: string

    @Field()
    @Column("text", { nullable: false })
    email: string

    @Field()
    @Column('bool', { default: false })
    is_activated: boolean

    @OneToMany(() => Story, story => story.creator)
    stories: Story[]

    @OneToMany(() => Upvote, upvote => upvote.user)
    upvotes: Upvote[]

    @Field()
    @CreateDateColumn()
    created_at: Date

    @Field()
    @UpdateDateColumn()
    updated_at: Date


}