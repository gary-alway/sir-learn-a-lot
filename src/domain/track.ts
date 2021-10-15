import { Field, InputType, ObjectType } from 'type-graphql'
import { Course } from './course'

@ObjectType()
export class Track {
  @Field()
  id!: string

  @Field()
  name!: string

  @Field(() => [Course])
  courses: Course[] | undefined
}

@InputType()
export class TrackInput implements Partial<Track> {
  @Field()
  name!: string
}
