import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { isEmail } from "class-validator";
import { v4 as uuid } from 'uuid';
import { sign } from 'jsonwebtoken';
// import { redis } from '../utils/redis';

import { redis } from "../utils/redis";
import { User } from "../entities/User";
import { NewUserInput } from "./partials/newUserInput";
import { sendEmail } from '../utils/templates/sendEmail';
import { VToken } from '../utils/types/Token.model';
import { UserInputError } from "apollo-server-express";
import { VerifyOTPInput } from "./partials/VerifyOTPInput";
// import { MyContext } from "src/utils/types/MyContext";

@ObjectType()
class LoginResponse {
    @Field()
    token: string;

    @Field(() => User)
    user: User
}

@ObjectType()
class OtpResponse {
    @Field()
    key: string;
}

@Resolver()
export class AuthResolver {

    @Mutation(() => Boolean)
    async register(@Arg("newUser") { name, email }: NewUserInput
    ): Promise<boolean> {
        const newUser = new User()
        newUser.username = name
        newUser.email = email
        await newUser.save();
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

    @Mutation(() => OtpResponse)
    async reqOtp(
        @Arg("email") email: string,
    ): Promise<OtpResponse> {
        if (!isEmail(email))
            throw new UserInputError("Email is not valid")

        const user = await User.findOne({ where: { email, is_activated: true } })
        if (!user) {
            throw new UserInputError("User not found")
        }

        const otp = Math.floor(Math.random() * 100000).toString()
        const otpId = uuid()
        // console.log(otpId)

        const details = {
            "forEmail": email,
            "success": true,
            "verified": false,
            "message": "OTP sent to user",
            "otp_id": otpId
        }
        const encoded = Buffer.from(JSON.stringify(details)).toString('base64')
        // console.log(encoded)
        try {
            await sendEmail(email, "OTP", `<p>Your OTP is ${otp}</p>`)
            await redis.set(otp, encoded, 'EX', 60 * 60 * 10)
        } catch (error) {
            console.log(error)
            throw new Error("Something went wrong")
        }
        return { key: encoded }
    }

    @Mutation(() => LoginResponse)
    async verifyOtp(@Arg('loginData') loginData: VerifyOTPInput): Promise<LoginResponse> {
        // verify otp and verify user
        const { email, otp, key } = loginData
        const details = JSON.parse(Buffer.from(key, 'base64').toString('ascii'))
        const { forEmail, otp_id, success, verified } = details

        if (!success || email != forEmail || !!verified) {
            throw new UserInputError("Invalid OTP")
        }
        //check if otp exists in redis
        const verificationKey = await redis.get(otp)
        if (!verificationKey) {                 // if hash expired
            throw new Error("Expired OTP")
        } else if (verificationKey !== key) {
            throw new Error("Could not complete verification")
        }

        let savedKeyObj = JSON.parse(Buffer.from(verificationKey, 'base64').toString('ascii'))  // from redis cache

        if (savedKeyObj.forEmail !== forEmail || savedKeyObj.otp_id != otp_id)
            throw new Error("Could not complete auth request - invalid data")
        // if (verified) {
        //     throw new Error("OTP already verified")
        // } not needed as we are using redis

        // create jwt token and delete otp from redis
        const user = await User.findOne({ where: { email, is_activated: true } })
        if (!user)
            throw new UserInputError("Something went wrong. Please try again")

        // generate jwt token
        const token = sign({ userId: user.id, username: user.username, email: user.email }, "KALASH SECRET", {
            expiresIn: "4h"
        })
        await redis.del(otp)
        return { user, token }
    }

    // whoami query to fetch user

    @Query(() => User, { nullable: true, complexity: 5 })
    async whoami(@Ctx() ctx): Promise<User | undefined> {
        if (!ctx.req.user) {
            return undefined;
        }
        console.log(ctx.req.user)
        return User.findOne(ctx.req.user!.userId);
    }


}

// const genExpDate = () => {
//     return new Date(Date.now() + 1000 * 60 * 60 * 24)
// }