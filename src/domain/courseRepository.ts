import { omit, pathOr } from 'ramda'
import { DynamoClient } from '../dynamoClient'
import { DDB_TABLE } from '../constants'
import { v4 as uuidv4 } from 'uuid'
import { addPrefix, removePrefix } from '../utils'
import { Course, CourseInput } from './course'
import { TRACK_PREFIX } from './trackRepository'
import { QueryInput } from 'aws-sdk/clients/dynamodb'

export const COURSE_PREFIX = 'c#'
const entityType = 'Course'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamoRecordToRecord = (record: any): Course => {
  const { pk, sk, gsi1_pk, gsi1_sk, ...data } = record

  return omit(['entityType'], {
    ...data,
    id: removePrefix(pk, COURSE_PREFIX),
    trackId: removePrefix(sk, TRACK_PREFIX)
  }) as Course
}

export const courseRepositoryFactory = (client: DynamoClient) => {
  const getCourseById = async (id: string): Promise<Course | undefined> =>
    client
      .query({
        TableName: DDB_TABLE,
        KeyConditionExpression: '#pk = :pk and begins_with (#sk, :sk)',
        ExpressionAttributeNames: {
          '#pk': 'pk',
          '#sk': 'sk'
        },
        ExpressionAttributeValues: {
          ':pk': addPrefix(id, COURSE_PREFIX),
          ':sk': TRACK_PREFIX
        }
      } as QueryInput)
      .then(res => {
        const record = pathOr<Course | undefined>(
          undefined,
          ['Items', '0'],
          res
        )
        return record ? dynamoRecordToRecord(record) : undefined
      })

  const getCoursesByTrackId = async (trackId: string): Promise<Course[]> =>
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
          ':gsi1_pk': addPrefix(trackId, TRACK_PREFIX),
          ':gsi1_sk': COURSE_PREFIX
        }
      } as QueryInput)
      .then(res =>
        pathOr<Course[]>([], ['Items'], res).map(dynamoRecordToRecord)
      )

  const saveCourse = async (
    { name, trackId }: CourseInput,
    id?: string
  ): Promise<Course> => {
    const _id = id ? removePrefix(id, COURSE_PREFIX) : uuidv4()
    const _trackId = removePrefix(trackId, TRACK_PREFIX)

    const record = {
      pk: addPrefix(_id, COURSE_PREFIX),
      sk: addPrefix(_trackId, TRACK_PREFIX),
      gsi1_pk: addPrefix(_trackId, TRACK_PREFIX),
      gsi1_sk: addPrefix(_id, COURSE_PREFIX),
      name,
      entityType
    }

    await client.putItem(record, DDB_TABLE)

    return {
      id: _id,
      trackId: _trackId,
      name,
      track: undefined,
      enrollments: undefined
    }
  }

  return {
    getCourseById,
    saveCourse,
    getCoursesByTrackId
  }
}
