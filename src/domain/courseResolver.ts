import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import { courseRepository } from '../constants'
import { Course, CourseInput } from './course'

@Resolver(Course)
export class CourseResolver {
  @Query(() => Course, { nullable: true })
  async getCourse(@Arg('id') id: string): Promise<Course | undefined> {
    return courseRepository.getCourseById(id)
  }

  @Mutation(() => Course)
  async addCourse(@Arg('CourseInput') { name }: CourseInput): Promise<Course> {
    return courseRepository.saveCourse({ name })
  }
}
