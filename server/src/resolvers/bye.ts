import { Resolver, Mutation, Arg, Field, ObjectType, Query } from "type-graphql";

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => String, { nullable: true })
    userMessage?: String;
}



@Resolver()
export class ByeResolver {
    // ...
    @Mutation(() => UserResponse)
    byeName(
        @Arg('name') name: String) {

        return {
            userMessage: `Goodbye ${name}`
        }
    }

    @Query(() => String)
    bye() {
        return "hello world";
    }
}


