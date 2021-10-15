import { omit } from 'ramda'
import { DynamoClient } from '../dynamoClient'
import { DDB_TABLE } from '../constants'
import { v4 as uuidv4 } from 'uuid'
import { addPrefix, removePrefix } from '../utils'
import { Student, StudentInput } from './student'
import { DynamoDB } from 'aws-sdk'

export const STUDENT_PREFIX = 's#'
const entityType = 'student'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamoRecordToRecord = (record: any): Student => {
  const { pk, ...data } = record

  return omit(['sk', 'entityType'], {
    ...data,
    id: removePrefix(pk, STUDENT_PREFIX)
  }) as Student
}

export const studentRepositoryFactory = (client: DynamoClient) => {
  const getStudentById = async (id: string): Promise<Student | undefined> =>
    client
      .getItem({
        TableName: DDB_TABLE,
        Key: {
          pk: addPrefix(id, STUDENT_PREFIX),
          sk: addPrefix(id, STUDENT_PREFIX)
        } as DynamoDB.Key
      })
      .then(({ Item }) => (Item ? dynamoRecordToRecord(Item) : undefined))

  const saveStudent = async (
    { firstname, lastname }: StudentInput,
    id?: string
  ): Promise<Student> => {
    const _id = id ? removePrefix(id, STUDENT_PREFIX) : uuidv4()

    const record = {
      pk: addPrefix(_id, STUDENT_PREFIX),
      sk: addPrefix(_id, STUDENT_PREFIX),
      firstname,
      lastname,
      entityType
    }

    await client.putItem(record, DDB_TABLE)

    return {
      id: _id,
      firstname,
      lastname
    }
  }

  return {
    getStudentById,
    saveStudent
  }
}
