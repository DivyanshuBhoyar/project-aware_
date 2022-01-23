import { UserInputError } from "apollo-server-express";
import { Story } from "../entities/Story";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { NewStoryInput } from "./partials/newStoryInput";

@Resolver()
export class StoryCRUDResolver {

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
        const story = Story.create({ ...newStoryData, user_id: ctx.req.user.userId })
        await story.save();
        return story;
    }
}