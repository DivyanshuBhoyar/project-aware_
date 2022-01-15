// import { redis } from '../utils/redis';

import { User } from "../entities/User";
import { Arg, Mutation, Resolver } from "type-graphql";
import { NewUserInput } from "./partials/newUserInput";
import { sendEmail } from '../utils/templates/sendEmail';
import { VToken } from '../utils/types/Token.model';


@Resolver()
export class AuthResolver {

    @Mutation(() => Boolean)
    async register(@Arg("newUser") { name, email }: NewUserInput
    ): Promise<boolean> {
        const newUser = new User()
        newUser.name = name
        newUser.email = email

        try {
            await newUser.save();
        } catch (error) {
            console.log(error)
            throw new Error("Something went wrong")
        }

        // const vToken = new VerifictationToken()
        // vToken._userId = newUser.id.toString()
        // vToken.expiresAt = genExpDate()
        const vToken = new VToken({
            userid: newUser.id.toString(),
        })

        try {
            await vToken.save()
            await sendEmail(newUser.email, "Confirm your email", `<button> <a href="http://localhost:4000/api/activate/${vToken._id}">Confirm your email</a> </button>`)
        } catch (e) {
            console.log(e)
            throw new Error("Something went wrong")
        }

        return true
    }
}

// const genExpDate = () => {
//     return new Date(Date.now() + 1000 * 60 * 60 * 24)
// }