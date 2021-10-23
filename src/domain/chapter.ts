import { Field, InputType, ObjectType } from 'type-graphql'
import { Course } from './course'

@ObjectType()
export class Chapter {
  @Field()
  id!: string

  @Field()
  courseId!: string

  @Field()
  content!: string

  @Field(() => Course)
  course: Course | undefined

  @Field(() => Number)
  latest: number | undefined
}

@InputType()
export class ChapterInput implements Partial<Chapter> {
  @Field()
  courseId!: string

  @Field()
  content!: string
}
