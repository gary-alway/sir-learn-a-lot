import { datatype, internet, lorem, name } from 'faker'
import { unnest } from 'ramda'
import {
  chapterRepository,
  courseRepository,
  enrollmentRepository,
  preferenceRepository,
  studentRepository,
  trackRepository
} from '../src/constants'

const seedDb = async () => {
  const tracks = await Promise.all(
    [...Array(4)].map(() => trackRepository.saveTrack({ name: lorem.words(2) }))
  )

  const courses = await Promise.all(
    tracks.map(async ({ id: trackId }) => {
      return Promise.all(
        [...Array(datatype.number(10) + 1)].map(
          async () =>
            await courseRepository.saveCourse({ trackId, name: lorem.words(4) })
        )
      )
    })
  )

  const students = await Promise.all(
    [...Array(20)].map(() =>
      studentRepository.saveStudent({
        firstName: name.firstName(),
        lastName: name.lastName(),
        email: internet.email()
      })
    )
  )

  const _courses = unnest(courses)

  await Promise.all(
    _courses.map(async ({ id: courseId }) => {
      return Promise.all(
        [...Array(datatype.number(10) + 1)].map(
          async () =>
            await chapterRepository.saveChapter({
              courseId,
              content: lorem.words(50)
            })
        )
      )
    })
  )

  const halfOfCourses = _courses.length / 2

  const firstFiveStudents = students.slice(0, 5)
  const firstHalfOfCourses = _courses.slice(0, halfOfCourses)

  await Promise.all(
    firstFiveStudents.map(async ({ id: studentId }) => {
      return Promise.all(
        firstHalfOfCourses.map(
          async ({ id: courseId }) =>
            await enrollmentRepository.saveEnrollment({ studentId, courseId })
        )
      )
    })
  )

  const studentId = students[students.length - 1].id

  await enrollmentRepository.saveEnrollment({
    studentId: studentId,
    courseId: _courses[_courses.length - 1].id
  })
  await enrollmentRepository.saveEnrollment({
    studentId: studentId,
    courseId: _courses[_courses.length - 2].id
  })

  await preferenceRepository.savePreference({
    studentId,
    trackId: tracks[0].id
  })

  console.log('Student with 2 enrollments and track preference', studentId)
}

seedDb()
  .then(() => process.exit(0))
  .catch(err => {
    console.log(err)
    process.exit(1)
  })
