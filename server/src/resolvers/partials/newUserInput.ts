import { MaxLength, MinLength, IsEmail } from "class-validator";
import { InputType, Field } from "type-graphql";
import { IsEmailAlreadyExist } from "./isEmailAlreadyExists";

@InputType()
export class NewUserInput {
    @Field()
    @MaxLength(20)
    @MinLength(2)
    name: string;

    @Field()
    @IsEmail()
    @IsEmailAlreadyExist({ message: "Email already exists" })
    email: string


}
