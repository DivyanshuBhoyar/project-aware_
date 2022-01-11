import { IsUUID } from "class-validator";
import { Field, InputType } from "type-graphql";


@InputType()
export class UpvoteAndReadArgs {

    @Field({ nullable: false })
    @IsUUID("4")
    id: string;


}