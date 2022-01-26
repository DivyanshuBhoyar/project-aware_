import { UserInputError } from "apollo-server-express";
import { Story } from "../entities/Story";
import { Arg, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, Root, } from "type-graphql";
import { NewStoryInput } from "./partials/newStoryInput";
import { User } from "../entities/User";

@Resolver(() => Story)
export class StoryCRUDResolver {


    @FieldResolver()
    async creator(@Root() story: Story): Promise<User> {
        return await User.findOneOrFail(story.creatorId)
    }


    @Query(() => [Story])
    async getStories(): Promise<Story[]> {
        return await Story.find();
    }

    @Query(() => Story)
    async getStory(
        @Arg('id') id: string
    ): Promise<Story> {
        const story = await Story.findOne(id)
        if (!story) {
            throw new UserInputError(`Story with id ${id} not found`)
        }
        return story;
    }

    @Authorized()
    @Mutation(() => Story)
    async newStory(
        @Arg('newStoryData') newStoryData: NewStoryInput,
        @Ctx() ctx
    ): Promise<Story> {
        console.log("idreceived", ctx.req.user.userId)
        const story = Story.create({ ...newStoryData, creatorId: ctx.req.user.userId })
        await story.save();
        return story;
    }
}