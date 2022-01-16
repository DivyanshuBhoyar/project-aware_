import { Arg, Field, Mutation, ObjectType, Resolver } from "type-graphql";
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

@ObjectType()
class LoginResponse {
    @Field()
    jwt: string;

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
        console.log(otpId)

        const details = {
            "forEmail": email,
            "success": true,
            "verified": false,
            "message": "OTP sent to user",
            "otp_id": otpId
        }
        const encoded = Buffer.from(JSON.stringify(details)).toString('base64')
        console.log(encoded)
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
        const decoded = Buffer.from(key, 'base64').toString('ascii')
        const details = JSON.parse(decoded)
        const { forEmail, otp_id, success, verified } = details
        console.log(details, email, otp, key)

        if (!success || email != forEmail || !!verified) {
            throw new UserInputError("Invalid OTP")
        }
        //check if otp exists in redis
        let verificationKey = await redis.get(otp)
        if (!verificationKey) {
            throw new Error("Expired OTP")
        } else if (verificationKey !== key) {
            throw new Error("Could not complete verification")
        }

        let savedKey = JSON.parse(Buffer.from(verificationKey, 'base64').toString('ascii'))
        if (savedKey.email !== forEmail || savedKey.otp_id != otp_id)
            throw new Error("Could not complete auth request")
        // if (verified) {
        //     throw new Error("OTP already verified")
        // } not needed as we are using redis

        // create jwt token and delete otp from redis
        const user = await User.findOne({ where: { email, is_activated: true } })
        if (!user)
            throw new UserInputError("Something went wrong. Please try again")

        // generate jwt token
        const jwt = sign({ userId: user.id, username: user.username, email: user.email }, "KALASH SECRET", {
            expiresIn: "1h"
        })

        await redis.del(otp)


        return { user, jwt }

    }
}

// const genExpDate = () => {
//     return new Date(Date.now() + 1000 * 60 * 60 * 24)
// }