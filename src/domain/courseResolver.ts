import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root
} from 'type-graphql'
import { courseRepository, trackRepository } from '../constants'
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
}
