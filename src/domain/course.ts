import { Field, InputType, ObjectType } from 'type-graphql'

@ObjectType()
export class Course {
  @Field()
  id!: string

  @Field()
  name!: string
}

@InputType()
export class CourseInput implements Partial<Course> {
  @Field()
  name!: string
}
