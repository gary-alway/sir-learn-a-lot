import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import { studentRepository } from '../constants'
import { Student, StudentInput } from './student'

@Resolver(() => Student)
export class StudentResolver {
  @Query(() => [Student], { nullable: true })
  async getStudent(id: string): Promise<Student | undefined> {
    return await studentRepository.getStudentById(id)
  }

  @Mutation(() => Student)
  async addStudent(
    @Arg('StudentInput') { firstname, lastname }: StudentInput
  ): Promise<Student> {
    return studentRepository.saveStudent({ firstname, lastname })
  }
}
