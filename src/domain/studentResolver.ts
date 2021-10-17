import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import { studentRepository } from '../constants'
import { Student, StudentInput } from './student'

@Resolver(Student)
export class StudentResolver {
  @Query(() => Student, { nullable: true })
  async getStudent(@Arg('id') id: string): Promise<Student | undefined> {
    return studentRepository.getStudentById(id)
  }

  @Query(() => Student, { nullable: true })
  async getStudentByEmail(
    @Arg('email') email: string
  ): Promise<Student | undefined> {
    const result = await studentRepository.getStudentByEmail(email)
    if (result.length > 1) {
      console.warn('Duplicate registration detected for email: ', email)
    }
    return result.length > 0 ? result[0] : undefined
  }

  @Mutation(() => Student)
  async addStudent(
    @Arg('StudentInput') { firstName, lastName, email }: StudentInput
  ): Promise<Student> {
    return studentRepository.saveStudent({ firstName, lastName, email })
  }
}
