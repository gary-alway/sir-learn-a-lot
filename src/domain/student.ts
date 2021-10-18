import { Field, InputType, ObjectType } from 'type-graphql'
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
