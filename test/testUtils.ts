import { studentRepository } from '../src/constants'
import { testStudent } from './testFactories'

export const createStudents = async (quantity: number) => {
  const students = [...Array(quantity)].map(_ => testStudent())
  await Promise.all([
    students.map(({ firstname, lastname }) =>
      studentRepository.saveStudent({ firstname, lastname })
    )
  ])
  return students
}
