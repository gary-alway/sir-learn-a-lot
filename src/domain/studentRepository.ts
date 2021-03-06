import { omit, pathOr } from 'ramda'
import { DynamoClient } from '../lib/dynamoClient'
import { DDB_TABLE } from '../constants'
import { v4 as uuidv4 } from 'uuid'
import { addPrefix, removePrefix } from '../lib/utils'
import { Student, StudentInput } from './student'
import { DynamoDB } from 'aws-sdk'
import { QueryInput } from 'aws-sdk/clients/dynamodb'

export const STUDENT_PREFIX = 's#'
const entityType = 'student'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamoRecordToRecord = (record: any): Student => {
  const { pk, gsi1_pk, ...data } = record

  return omit(['sk', 'gsi1_sk', 'entityType'], {
    ...data,
    id: removePrefix(pk, STUDENT_PREFIX),
    email: removePrefix(gsi1_pk, STUDENT_PREFIX)
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

  /**
   * Get student by email should only return a single record.
   * If it returns more than one record then a duplicate registration has occurred
   * which needs to be resolved manually.
   * @param email
   * @returns Student[]
   */
  const getStudentByEmail = async (email: string): Promise<Student[]> =>
    client
      .query({
        TableName: DDB_TABLE,
        IndexName: 'gsi1',
        KeyConditionExpression: '#gsi1_pk = :gsi1_pk',
        ExpressionAttributeNames: {
          '#gsi1_pk': 'gsi1_pk'
        },
        ExpressionAttributeValues: {
          ':gsi1_pk': addPrefix(email.toLocaleLowerCase(), STUDENT_PREFIX)
        }
      } as QueryInput)
      .then(res => {
        return pathOr<Student[]>([], ['Items'], res).map(dynamoRecordToRecord)
      })

  interface AtomicUpdateStudentXp {
    studentId: string
    xp: number
  }

  const atomicUpdateStudentXp = async ({
    studentId,
    xp
  }: AtomicUpdateStudentXp) => {
    const _studentId = removePrefix(studentId, STUDENT_PREFIX)

    await client.updateItem({
      TableName: DDB_TABLE,
      Key: {
        pk: addPrefix(_studentId, STUDENT_PREFIX),
        sk: addPrefix(_studentId, STUDENT_PREFIX)
      },
      UpdateExpression: 'set xp = xp + :inc',
      ExpressionAttributeValues: {
        ':inc': xp
      }
    })
  }

  const saveStudent = async ({
    firstName,
    lastName,
    email
  }: StudentInput): Promise<Student> => {
    const _id = uuidv4()
    const _email = email.toLocaleLowerCase()
    const xp = 0

    const record = {
      pk: addPrefix(_id, STUDENT_PREFIX),
      sk: addPrefix(_id, STUDENT_PREFIX),
      gsi1_pk: addPrefix(_email, STUDENT_PREFIX),
      gsi1_sk: addPrefix(_id, STUDENT_PREFIX),
      firstName,
      lastName,
      xp,
      entityType
    }

    await client.putItem(record, DDB_TABLE)

    return {
      id: _id,
      firstName,
      lastName,
      email: _email,
      xp,
      preferences: undefined,
      enrollments: undefined
    }
  }

  return {
    getStudentById,
    getStudentByEmail,
    saveStudent,
    atomicUpdateStudentXp
  }
}
