import { Field, InputType, ObjectType } from 'type-graphql'

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
