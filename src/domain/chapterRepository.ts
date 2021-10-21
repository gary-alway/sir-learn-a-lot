import { omit, pathOr } from 'ramda'
import { DynamoClient } from '../dynamoClient'
import { DDB_TABLE } from '../constants'
import { v4 as uuidv4 } from 'uuid'
import { addPrefix, removePrefix } from '../utils'
import { Chapter, ChapterInput } from './chapter'
import { QueryInput } from 'aws-sdk/clients/dynamodb'
import { COURSE_PREFIX } from './courseRepository'

export const CHAPTER_PREFIX = 'h#'
const entityType = 'chapter'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamoRecordToRecord = (record: any): Chapter => {
  const { pk, sk, ...data } = record

  return omit(['gsi1_pk', 'gsi1_sk', 'entityType'], {
    ...data,
    id: removePrefix(sk, CHAPTER_PREFIX),
    courseId: removePrefix(pk, COURSE_PREFIX)
  }) as Chapter
}

export const chapterRepositoryFactory = (client: DynamoClient) => {
  const getChapterById = async (
    chapterId: string
  ): Promise<Chapter | undefined> =>
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
          ':gsi1_pk': addPrefix(chapterId, CHAPTER_PREFIX),
          ':gsi1_sk': COURSE_PREFIX
        }
      } as QueryInput)
      .then(res => {
        const record = pathOr<Chapter | undefined>(
          undefined,
          ['Items', '0'],
          res
        )
        return record ? dynamoRecordToRecord(record) : undefined
      })

  const getChaptersByCourseId = async (courseId: string): Promise<Chapter[]> =>
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
          ':sk': CHAPTER_PREFIX
        }
      } as QueryInput)
      .then(res =>
        pathOr<Chapter[]>([], ['Items'], res).map(dynamoRecordToRecord)
      )

  const saveChapter = async (
    { courseId, content }: ChapterInput,
    id?: string
  ): Promise<Chapter> => {
    const _id = id ? removePrefix(id, CHAPTER_PREFIX) : uuidv4()
    const _courseId = removePrefix(courseId, COURSE_PREFIX)

    const record = {
      pk: addPrefix(_courseId, COURSE_PREFIX),
      sk: addPrefix(_id, CHAPTER_PREFIX),
      gsi1_pk: addPrefix(_id, CHAPTER_PREFIX),
      gsi1_sk: addPrefix(_courseId, COURSE_PREFIX),
      content,
      entityType
    }

    await client.putItem(record, DDB_TABLE)

    return {
      id: _id,
      courseId: _courseId,
      content,
      course: undefined
    }
  }

  return {
    getChapterById,
    getChaptersByCourseId,
    saveChapter
  }
}
