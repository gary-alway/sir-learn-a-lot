import { Field, InputType, ObjectType } from 'type-graphql'
import { Enrollment } from './enrollment'
import { Track } from './track'

@ObjectType()
export class Course {
  @Field()
  id!: string

  @Field()
  trackId!: string

  @Field()
  name!: string

  @Field(() => Track)
  track: Track | undefined

  @Field(() => [Enrollment])
  enrollments: Enrollment[] | undefined
}

@InputType()
export class CourseInput implements Partial<Course> {
  @Field()
  trackId!: string

  @Field()
  name!: string
}
