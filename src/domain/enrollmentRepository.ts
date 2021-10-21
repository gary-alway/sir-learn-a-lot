import { omit, pathOr } from 'ramda'
import { DynamoClient } from '../dynamoClient'
import { DDB_TABLE } from '../constants'
import { v4 as uuidv4 } from 'uuid'
import { addPrefix, removePrefix } from '../utils'
import { Enrollment, EnrollmentInput } from './enrollment'
import { COURSE_PREFIX } from './courseRepository'
import { QueryInput } from 'aws-sdk/clients/dynamodb'
import { STUDENT_PREFIX } from './studentRepository'

export const ENROLLMENT_PREFIX = 'e#'
const entityType = 'enrollment'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamoRecordToRecord = (record: any): Enrollment => {
  const { pk, sk, gsi2_pk, ...data } = record

  return omit(['gsi1_pk', 'gsi1_sk', 'gsi2_sk', 'entityType'], {
    ...data,
    id: removePrefix(sk, ENROLLMENT_PREFIX),
    courseId: removePrefix(pk, COURSE_PREFIX),
    studentId: removePrefix(gsi2_pk, STUDENT_PREFIX)
  }) as Enrollment
}

export const enrollmentRepositoryFactory = (client: DynamoClient) => {
  const getEnrollmentById = async (
    id: string
  ): Promise<Enrollment | undefined> =>
    client
      .query({
        TableName: DDB_TABLE,
        KeyConditionExpression:
          '#gsi1_pk = :gsi1_pk and begins_with (#gsi1_sk, :gsi1_sk)',
        ExpressionAttributeNames: {
          '#gsi1_pk': 'gsi1_pk',
          '#gsi1_sk': 'gsi1_sk'
        },
        ExpressionAttributeValues: {
          ':gsi1_pk': addPrefix(id, ENROLLMENT_PREFIX),
          ':gsi1_sk': COURSE_PREFIX
        }
      } as QueryInput)
      .then(res => {
        const record = pathOr<Enrollment | undefined>(
          undefined,
          ['Items', '0'],
          res
        )
        return record ? dynamoRecordToRecord(record) : undefined
      })

  const getEnrollmentsByCourseId = async (
    courseId: string
  ): Promise<Enrollment[]> =>
    client
      .query({
        TableName: DDB_TABLE,
        KeyConditionExpression: '#pk = :pk and begins_with (#sk, :sk)',
        ExpressionAttributeNames: {
          '#pk': 'pk',
          '#sk': 'sk'
        },
        ExpressionAttributeValues: {
          ':pk': addPrefix(courseId, COURSE_PREFIX),
          ':sk': ENROLLMENT_PREFIX
        }
      } as QueryInput)
      .then(res =>
        pathOr<Enrollment[]>([], ['Items'], res).map(dynamoRecordToRecord)
      )

  const getEnrollmentsByStudentId = async (
    courseId: string
  ): Promise<Enrollment[]> =>
    client
      .query({
        TableName: DDB_TABLE,
        IndexName: 'gsi2',
        KeyConditionExpression:
          '#gsi2_pk = :gsi2_pk and begins_with (#gsi2_sk, :gsi2_sk)',
        ExpressionAttributeNames: {
          '#gsi2_pk': 'gsi2_pk',
          '#gsi2_sk': 'gsi2_sk'
        },
        ExpressionAttributeValues: {
          ':gsi2_pk': addPrefix(courseId, STUDENT_PREFIX),
          ':gsi2_sk': ENROLLMENT_PREFIX
        }
      } as QueryInput)
      .then(res =>
        pathOr<Enrollment[]>([], ['Items'], res).map(dynamoRecordToRecord)
      )

  const saveEnrollment = async (
    { courseId, studentId }: EnrollmentInput,
    id?: string
  ): Promise<Enrollment> => {
    const _id = id ? removePrefix(id, ENROLLMENT_PREFIX) : uuidv4()
    const _courseId = removePrefix(courseId, COURSE_PREFIX)
    const _studentId = removePrefix(studentId, STUDENT_PREFIX)
    const date = new Date().toISOString()

    const record = {
      pk: addPrefix(_courseId, COURSE_PREFIX),
      sk: addPrefix(_id, ENROLLMENT_PREFIX),
      gsi1_pk: addPrefix(_id, ENROLLMENT_PREFIX),
      gsi1_sk: addPrefix(_courseId, COURSE_PREFIX),
      gsi2_pk: addPrefix(_studentId, STUDENT_PREFIX),
      gsi2_sk: addPrefix(_id, ENROLLMENT_PREFIX),
      date,
      entityType
    }

    await client.putItem(record, DDB_TABLE)

    return {
      id: _id,
      courseId: _courseId,
      studentId: _studentId,
      date,
      course: undefined,
      student: undefined
    }
  }

  return {
    getEnrollmentById,
    getEnrollmentsByCourseId,
    getEnrollmentsByStudentId,
    saveEnrollment
  }
}
