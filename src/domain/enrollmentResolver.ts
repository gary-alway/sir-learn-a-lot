import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root
} from 'type-graphql'
import {
  courseRepository,
  enrollmentRepository,
  progressRepository,
  studentRepository
} from '../constants'
import { Enrollment, EnrollmentInput } from './enrollment'
import { Progress, ProgressInput } from './progress'

@Resolver(Enrollment)
export class EnrollmentResolver {
  @Query(() => Enrollment, { nullable: true })
  async getEnrollment(@Arg('id') id: string): Promise<Enrollment | undefined> {
    return enrollmentRepository.getEnrollmentById(id)
  }

  @Mutation(() => Enrollment)
  async addEnrollment(
    @Arg('EnrollmentInput') { courseId, studentId }: EnrollmentInput
  ): Promise<Enrollment> {
    return enrollmentRepository.saveEnrollment({ courseId, studentId })
  }

  @FieldResolver()
  course(@Root() enrollment: Enrollment) {
    return courseRepository.getCourseById(enrollment.courseId)
  }

  @FieldResolver()
  student(@Root() enrollment: Enrollment) {
    return studentRepository.getStudentById(enrollment.studentId)
  }

  @FieldResolver()
  progress(@Root() enrollment: Enrollment) {
    return progressRepository.getProgressByEnrollmentId(enrollment.id)
  }
}

@Resolver(Progress)
export class ProgressResolver {
  @Mutation(() => Progress)
  async addProgress(
    @Arg('ProgressInput')
    { studentId, chapterId, enrollmentId, marker, xp }: ProgressInput
  ): Promise<Progress> {
    return progressRepository.saveProgress({
      studentId,
      chapterId,
      enrollmentId,
      marker,
      xp
    })
  }
}
