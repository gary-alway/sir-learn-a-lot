import { omit, pathOr } from 'ramda'
import { DynamoClient } from '../lib/dynamoClient'
import { DDB_TABLE } from '../constants'
import { v4 as uuidv4 } from 'uuid'
import { addPrefix, removePrefix } from '../lib/utils'
import { Chapter, ChapterInput } from './chapter'
import { PutItemInputAttributeMap, QueryInput } from 'aws-sdk/clients/dynamodb'
import { COURSE_PREFIX } from './courseRepository'

export const CHAPTER_PREFIX = 'h#'
const entityType = 'chapter'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamoRecordToRecord = (record: any): Chapter => {
  const { pk, gsi1_pk, ...data } = record

  return omit(['sk', 'gsi1_sk', 'entityType'], {
    ...data,
    id: removePrefix(gsi1_pk, CHAPTER_PREFIX),
    courseId: removePrefix(pk, COURSE_PREFIX)
  }) as Chapter
}

export const chapterRepositoryFactory = (client: DynamoClient) => {
  const getChapterByVersion = async (
    chapterId: string,
    version: number
  ): Promise<Chapter | undefined> =>
    client
      .query({
        TableName: DDB_TABLE,
        IndexName: 'gsi1',
        KeyConditionExpression: '#gsi1_pk = :gsi1_pk and #gsi1_sk = :gsi1_sk',
        ExpressionAttributeNames: {
          '#gsi1_pk': 'gsi1_pk',
          '#gsi1_sk': 'gsi1_sk'
        },
        ExpressionAttributeValues: {
          ':gsi1_pk': addPrefix(chapterId, CHAPTER_PREFIX),
          ':gsi1_sk': `v${version}`
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

  const getChapterById = async (id: string): Promise<Chapter | undefined> =>
    getChapterByVersion(id, 0)

  const getChaptersByCourseId = async (courseId: string): Promise<Chapter[]> =>
    client
      .query({
        TableName: DDB_TABLE,
        KeyConditionExpression: '#pk = :pk and begins_with (#sk, :sk)',
        ExpressionAttributeNames: {
          '#pk': 'pk',
          '#sk': 'sk',
          '#gsi1_sk': 'gsi1_sk'
        },
        ExpressionAttributeValues: {
          ':pk': addPrefix(courseId, COURSE_PREFIX),
          ':sk': CHAPTER_PREFIX,
          ':v0': 'v0'
        },
        FilterExpression: '#gsi1_sk = :v0'
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

    const existing = await getChapterById(_id)
    // WARNING!! TODO: FIXME: This is now potentially stale data until

    const version = existing ? existing.latest! + 1 : 1

    const record = {
      pk: addPrefix(_courseId, COURSE_PREFIX),
      gsi1_pk: addPrefix(_id, CHAPTER_PREFIX),
      content,
      entityType
    }

    await client.executeTransactWrite({
      TransactItems: [
        {
          Put: {
            TableName: DDB_TABLE,
            Item: {
              ...record,
              sk: `${addPrefix(_id, CHAPTER_PREFIX)}#v0`,
              gsi1_sk: 'v0',
              latest: version
            } as PutItemInputAttributeMap
          }
        },
        {
          Put: {
            TableName: DDB_TABLE,
            Item: {
              ...record,
              sk: `${addPrefix(_id, CHAPTER_PREFIX)}#v${version}`,
              gsi1_sk: `v${version}`
            } as PutItemInputAttributeMap
          }
        }
      ]
    })

    return {
      id: _id,
      courseId: _courseId,
      content,
      course: undefined,
      latest: undefined
    }
  }

  return {
    getChapterById,
    getChapterByVersion,
    getChaptersByCourseId,
    saveChapter
  }
}
