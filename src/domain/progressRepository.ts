import { DynamoClient } from '../lib/dynamoClient'
import { DDB_TABLE } from '../constants'
import { addPrefix, removePrefix } from '../lib/utils'
import { Progress, ProgressInput } from './progress'
import { STUDENT_PREFIX } from './studentRepository'
import { QueryInput } from 'aws-sdk/clients/dynamodb'
import { omit, pathOr } from 'ramda'
import { CHAPTER_PREFIX } from './chapterRepository'
import { ENROLLMENT_PREFIX } from './enrollmentRepository'

export const PROGRESS_PREFIX = 'g#'
const entityType = 'progress'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamoRecordToRecord = (record: any): Progress => {
  const { pk, gsi1_pk, ...data } = record

  return omit(['gsi1_sk', 'sk', 'entityType'], {
    ...data,
    studentId: removePrefix(pk, STUDENT_PREFIX),
    enrollmentId: removePrefix(gsi1_pk, ENROLLMENT_PREFIX)
  }) as Progress
}

export const progressRepositoryFactory = (client: DynamoClient) => {
  const getProgressByEnrollmentId = async (
    enrollmentId: string
  ): Promise<Progress[]> =>
    client
      .query({
        TableName: DDB_TABLE,
        IndexName: 'gsi1',
        KeyConditionExpression:
          '#gsi1_pk = :gsi1_pk and begins_with (#gsi1_sk, :gsi1_sk)',
        ExpressionAttributeNames: {
          '#gsi1_pk': 'gsi1_pk',
          '#gsi1_sk': 'gsi1_sk'
        },
        ExpressionAttributeValues: {
          ':gsi1_pk': addPrefix(enrollmentId, ENROLLMENT_PREFIX),
          ':gsi1_sk': PROGRESS_PREFIX
        }
      } as QueryInput)
      .then(res =>
        pathOr<Progress[]>([], ['Items'], res).map(dynamoRecordToRecord)
      )

  const saveProgress = async ({
    studentId,
    chapterId,
    enrollmentId,
    marker,
    xp
  }: ProgressInput): Promise<Progress> => {
    const _studentId = removePrefix(studentId, STUDENT_PREFIX)
    const _chapterId = removePrefix(chapterId, CHAPTER_PREFIX)
    const _enrollmentId = removePrefix(enrollmentId, CHAPTER_PREFIX)

    const compositeSk = `${PROGRESS_PREFIX}${ENROLLMENT_PREFIX}${_enrollmentId}#${CHAPTER_PREFIX}${_chapterId}`
    const compositeGsi1Sk = `${PROGRESS_PREFIX}${STUDENT_PREFIX}${_studentId}#${CHAPTER_PREFIX}${_chapterId}`

    const record = {
      pk: addPrefix(_studentId, STUDENT_PREFIX),
      sk: compositeSk,
      gsi1_pk: addPrefix(_enrollmentId, ENROLLMENT_PREFIX),
      gsi1_sk: compositeGsi1Sk,
      chapterId: _chapterId,
      marker,
      xp,
      entityType
    }

    await client.putItem(record, DDB_TABLE)

    return {
      studentId: _studentId,
      chapterId: _chapterId,
      enrollmentId: _enrollmentId,
      marker,
      xp
    }
  }

  return {
    getProgressByEnrollmentId,
    saveProgress
  }
}
