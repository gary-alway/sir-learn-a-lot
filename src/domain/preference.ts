import { Field, InputType, ObjectType } from 'type-graphql'
import { Student } from './student'
import { Track } from './track'

@ObjectType()
export class Preference {
  @Field()
  studentId!: string

  @Field()
  trackId!: string

  @Field(() => Student)
  student: Student[] | undefined

  @Field(() => Track)
  track: Track[] | undefined
}

@InputType()
export class PreferenceInput implements Partial<Preference> {
  @Field()
  studentId!: string

  @Field()
  trackId!: string
}
