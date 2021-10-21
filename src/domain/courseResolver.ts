import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root
} from 'type-graphql'
import {
  chapterRepository,
  courseRepository,
  enrollmentRepository,
  trackRepository
} from '../constants'
import { Course, CourseInput } from './course'

@Resolver(Course)
export class CourseResolver {
  @Query(() => Course, { nullable: true })
  async getCourse(@Arg('id') id: string): Promise<Course | undefined> {
    return courseRepository.getCourseById(id)
  }

  @Mutation(() => Course)
  async addCourse(
    @Arg('CourseInput') { name, trackId }: CourseInput
  ): Promise<Course> {
    return courseRepository.saveCourse({ name, trackId })
  }

  @FieldResolver()
  track(@Root() course: Course) {
    return trackRepository.getTrackById(course.trackId)
  }

  @FieldResolver()
  enrollments(@Root() course: Course) {
    return enrollmentRepository.getEnrollmentsByCourseId(course.id)
  }

  @FieldResolver()
  chapters(@Root() course: Course) {
    return chapterRepository.getChaptersByCourseId(course.id)
  }
}
