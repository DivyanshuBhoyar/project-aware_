import { Entity, BaseEntity, Column, PrimaryColumn, ManyToOne } from "typeorm";
import { Story } from "./Story";
import { User } from "./User";

@Entity()
export class Upvote extends BaseEntity {
    @Column({ type: "int" })
    value: number;

    @PrimaryColumn()
    userId: number;

    @ManyToOne(() => User, (user) => user.upvotes)
    user: User;

    @PrimaryColumn()
    postId: number;

    @ManyToOne(() => Story, (story) => story.upvotes, {
        onDelete: "CASCADE",
    })
    post: Story;
}