import { MaxLength, Length, MinLength } from "class-validator";
import { InputType, Field } from "type-graphql";

@InputType()
export class NewStoryInput {
    @Field()
    @MaxLength(100)
    title: string;

    @Field()
    @Length(10, 255)
    description: string;

    @Field({ description: "The name of the product" })
    @MaxLength(30)
    @MinLength(2)
    productName: string


}

