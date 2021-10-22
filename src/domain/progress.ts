import { Field, InputType, ObjectType } from 'type-graphql'

@ObjectType()
export class Progress {
  @Field()
  studentId!: string

  @Field()
  chapterId!: string

  @Field()
  enrollmentId!: string

  @Field()
  xp!: number

  @Field()
  marker!: string
}

@InputType()
export class ProgressInput implements Partial<Progress> {
  @Field()
  studentId!: string

  @Field()
  chapterId!: string

  @Field()
  enrollmentId!: string

  @Field()
  xp!: number

  @Field()
  marker!: string
}
