import { Field, InputType, ObjectType } from 'type-graphql'
import { Enrollment } from './enrollment'
import { Preference } from './preference'

@ObjectType()
export class Student {
  @Field()
  id!: string

  @Field()
  firstName!: string

  @Field()
  lastName!: string

  @Field()
  email!: string

  @Field(() => [Preference])
  preferences: Preference[] | undefined

  @Field(() => [Enrollment])
  enrollments: Enrollment[] | undefined
}

@InputType()
export class StudentInput implements Partial<Student> {
  @Field()
  firstName!: string

  @Field()
  lastName!: string

  @Field()
  email!: string
}
