
import { Story } from "../entities/Story";
import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { NewStoryInput } from "./partials/newStoryInput";
import { UpvoteAndReadArgs } from "./partials/upvoteArgs";
import { UserInputError } from "apollo-server-express";

@Resolver()
export class StoryResolver {

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

    @Mutation(() => Story)
    async newStory(
        @Arg('data') newData: NewStoryInput
    ): Promise<Story> {
        const story = Story.create(newData);
        await story.save();
        return story;
    }

    @Mutation(() => Int)
    async upvoteStory(
        @Arg('arg') arg: UpvoteAndReadArgs
    ): Promise<number> {
        const story = await Story.findOne(arg.id)
        if (!story) {
            throw new UserInputError('Story not found')
        }
        story!.upvotes += 1;
        await story!.save();
        return story!.upvotes;
    }

    @Mutation(() => Int)
    async addReadCount(
        @Arg('arg') arg: UpvoteAndReadArgs
    ): Promise<number> {
        const story = await Story.findOne(arg.id)
        if (!story) {
            throw new UserInputError('Story not found')
        }
        story!.reads += 1;
        await story!.save();
        return story!.reads;
    }
}