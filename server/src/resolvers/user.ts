

import { sendEmail } from "../utils/sendEmail";
import { Arg, Mutation, Resolver } from "type-graphql";
import { NewUserInput } from "./partials/newUserInput";
import { User } from "../entities/User";



@Resolver()
export class UserResolver {

    @Mutation(() => Boolean)
    async register(@Arg("newUser") { name, email }: NewUserInput
    ): Promise<boolean> {

        // send otp to given email address
        const otp = Math.floor(Math.random() * 10000) + 1000;
        try {
            await sendEmail(email, `Your otp is ${otp}`)
        } catch (e) {
            console.log(e)
            throw new Error('Something went wrong')
        }

        const newUser = new User();
        newUser.name = name;
        newUser.email = email;
        newUser.otp = otp;

        await newUser.save()
            .then(() => { })
            .catch(e => {
                console.log(e)
                throw new Error('Something went wrong')
            });

        return true
    }
}