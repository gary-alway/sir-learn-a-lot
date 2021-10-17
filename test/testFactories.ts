import { datatype, name } from 'faker'
import { Student } from '../src/domain/student'

export const testStudent = (overrides: Partial<Student> = {}): Student => ({
  id: datatype.uuid(),
  firstname: name.firstName(),
  lastname: name.lastName(),
  ...overrides
})
