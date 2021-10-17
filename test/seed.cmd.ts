import { datatype, lorem, name } from 'faker'
import {
  courseRepository,
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
        firstname: name.firstName(),
        lastname: name.lastName()
      })
    )
  )

  // todo: enrollments

  console.log(courses, students)
}

seedDb()
  .then(() => process.exit(0))
  .catch(err => {
    console.log(err)
    process.exit(1)
  })
