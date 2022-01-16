import { IsBase64, IsEmail, IsNotEmpty } from "class-validator";
import { InputType, Field } from "type-graphql";

@InputType()
export class VerifyOTPInput {
    @Field()
    @IsEmail()
    email: string;

    @Field()
    @IsNotEmpty()
    // @Length(6)
    otp: string

    @Field()
    @IsNotEmpty()
    @IsBase64()
    key: string

}
