import { Field, InputType, ObjectType } from 'type-graphql'
import { Course } from './course'
import { Student } from './student'

@ObjectType()
export class Enrollment {
  @Field()
  id!: string

  @Field()
  courseId!: string

  @Field()
  studentId!: string

  @Field()
  date!: string

  @Field(() => Course)
  course: Course | undefined

  @Field(() => Student)
  student: Student | undefined
}

@InputType()
export class EnrollmentInput implements Partial<Enrollment> {
  @Field()
  courseId!: string

  @Field()
  studentId!: string
}
