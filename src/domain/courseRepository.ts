import { omit } from 'ramda'
import { DynamoClient } from '../dynamoClient'
import { DDB_TABLE } from '../constants'
import { v4 as uuidv4 } from 'uuid'
import { addPrefix, removePrefix } from '../utils'
import { Course, CourseInput } from './course'
import { DynamoDB } from 'aws-sdk'

export const COURSE_PREFIX = 'c#'
const entityType = 'Course'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamoRecordToRecord = (record: any): Course => {
  const { pk, ...data } = record

  return omit(['sk', 'entityType'], {
    ...data,
    id: removePrefix(pk, COURSE_PREFIX)
  }) as Course
}

export const courseRepositoryFactory = (client: DynamoClient) => {
  const getCourseById = async (id: string): Promise<Course | undefined> =>
    client
      .getItem({
        TableName: DDB_TABLE,
        Key: {
          pk: addPrefix(id, COURSE_PREFIX),
          sk: addPrefix(id, COURSE_PREFIX)
        } as DynamoDB.Key
      })
      .then(({ Item }) => (Item ? dynamoRecordToRecord(Item) : undefined))

  const saveCourse = async (
    { name }: CourseInput,
    id?: string
  ): Promise<Course> => {
    const _id = id ? removePrefix(id, COURSE_PREFIX) : uuidv4()

    const record = {
      pk: addPrefix(_id, COURSE_PREFIX),
      sk: addPrefix(_id, COURSE_PREFIX),
      name,
      entityType
    }

    await client.putItem(record, DDB_TABLE)

    return {
      id: _id,
      name
    }
  }

  return {
    getCourseById,
    saveCourse
  }
}
