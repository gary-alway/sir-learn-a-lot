import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root
} from 'type-graphql'
import {
  enrollmentRepository,
  preferenceRepository,
  studentRepository,
  trackRepository
} from '../constants'
import { Preference, PreferenceInput } from './preference'
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

  @FieldResolver()
  preferences(@Root() student: Student) {
    return preferenceRepository.getStudentPreferences(student.id)
  }

  @FieldResolver()
  enrollments(@Root() student: Student) {
    return enrollmentRepository.getEnrollmentsByStudentId(student.id)
  }
}

// preference resolver can't be in its own file because graphql blows up with duplicate preference types
@Resolver(Preference)
export class PreferenceResolver {
  @Query(() => [Preference], { nullable: true })
  async getStudentPreferences(
    @Arg('studentId') studentId: string
  ): Promise<Preference[]> {
    return preferenceRepository.getStudentPreferences(studentId)
  }

  @Mutation(() => Preference)
  async addPreference(
    @Arg('PreferenceInput') { studentId, trackId }: PreferenceInput
  ): Promise<Preference> {
    return preferenceRepository.savePreference({ studentId, trackId })
  }

  @FieldResolver()
  student(@Root() preference: Preference) {
    return studentRepository.getStudentById(preference.studentId)
  }

  @FieldResolver()
  track(@Root() preference: Preference) {
    return trackRepository.getTrackById(preference.trackId)
  }
}
