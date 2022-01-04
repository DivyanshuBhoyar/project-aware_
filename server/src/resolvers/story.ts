// import { Story } from "../models/Story";
import { Story } from "../models/Story";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { NewStoryInput } from "../partials/newStoryInput";


@Resolver()
export class StoryResolver {

    @Query(() => [Story])
    async getStories(): Promise<Story[]> {
        return Story.find();
    }

    @Mutation(() => Story)
    async newStory(
        @Arg('data') newData: NewStoryInput
    ): Promise<Story> {
        const story = Story.create(newData);
        await story.save();
        return story;
    }
}