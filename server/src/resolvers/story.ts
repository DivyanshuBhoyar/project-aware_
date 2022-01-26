
import { Story } from "../entities/Story";
import { Arg, Authorized, Int, Mutation, Resolver } from "type-graphql";
import { UpvoteAndReadArgs } from "./partials/upvoteArgs";
import { UserInputError } from "apollo-server-express";

@Resolver()
export class StoryResolver {


    // @Authorized()
    // @Mutation(() => Int)
    // async upvoteStory(
    //     @Arg('arg') arg: UpvoteAndReadArgs
    // ): Promise<number> {
    //     const story = await Story.findOne(arg.id)
    //     if (!story) {
    //         throw new UserInputError('Story not found')
    //     }
    //     story!.upvotes += 1;
    //     await story!.save();
    //     return story!.upvotes;
    // }

    @Authorized()
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