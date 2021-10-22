import { Field, InputType, ObjectType } from 'type-graphql'
import { Course } from './course'
import { Progress } from './progress'
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

  @Field(() => [Progress])
  progress: Progress | undefined
}

@InputType()
export class EnrollmentInput implements Partial<Enrollment> {
  @Field()
  courseId!: string

  @Field()
  studentId!: string
}
