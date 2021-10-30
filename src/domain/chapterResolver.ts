import { Arg, Mutation, Resolver } from 'type-graphql'
import { chapterRepository } from '../constants'
import { Chapter, ChapterInput } from './chapter'

@Resolver(Chapter)
export class ChapterResolver {
  @Mutation(() => Chapter)
  async addChapter(
    @Arg('ChapterInput')
    { courseId, content }: ChapterInput
  ): Promise<Chapter> {
    return chapterRepository.saveChapter({ courseId, content })
  }
}
