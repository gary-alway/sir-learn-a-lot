import { Field, InputType, ObjectType } from 'type-graphql'

@ObjectType()
export class Student {
  @Field()
  id!: string

  @Field()
  firstname!: string

  @Field()
  lastname!: string
}

@InputType()
export class StudentInput implements Partial<Student> {
  @Field()
  firstname!: string

  @Field()
  lastname!: string
}
