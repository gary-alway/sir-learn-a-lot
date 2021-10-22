import { omit, pathOr } from 'ramda'
import { DynamoClient } from '../lib/dynamoClient'
import { DDB_TABLE } from '../constants'
import { v4 as uuidv4 } from 'uuid'
import { addPrefix, removePrefix } from '../lib/utils'
import { Track, TrackInput } from './track'
import { DynamoDB } from 'aws-sdk'
import { QueryInput } from 'aws-sdk/clients/dynamodb'

export const TRACK_PREFIX = 't#'
const entityType = 'track'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamoRecordToRecord = (record: any): Track => {
  const { pk, ...data } = record

  return omit(['gsi1_pk', 'gsi1_sk', 'sk', 'entityType'], {
    ...data,
    id: removePrefix(pk, TRACK_PREFIX)
  }) as Track
}

export const trackRepositoryFactory = (client: DynamoClient) => {
  const getTrackById = async (id: string): Promise<Track | undefined> =>
    client
      .getItem({
        TableName: DDB_TABLE,
        Key: {
          pk: addPrefix(id, TRACK_PREFIX),
          sk: addPrefix(id, TRACK_PREFIX)
        } as DynamoDB.Key
      })
      .then(({ Item }) => (Item ? dynamoRecordToRecord(Item) : undefined))

  const getTracks = async (): Promise<Track[]> =>
    client
      .query({
        TableName: DDB_TABLE,
        IndexName: 'gsi1',
        KeyConditionExpression: '#gsi1_pk = :gsi1_pk',
        ExpressionAttributeNames: {
          '#gsi1_pk': 'gsi1_pk'
        },
        ExpressionAttributeValues: {
          ':gsi1_pk': entityType
        }
      } as QueryInput)
      .then(res =>
        pathOr<Track[]>([], ['Items'], res).map(dynamoRecordToRecord)
      )

  const saveTrack = async (
    { name }: TrackInput,
    id?: string
  ): Promise<Track> => {
    const _id = id ? removePrefix(id, TRACK_PREFIX) : uuidv4()

    const record = {
      pk: addPrefix(_id, TRACK_PREFIX),
      sk: addPrefix(_id, TRACK_PREFIX),
      gsi1_pk: entityType,
      gsi1_sk: _id,
      name,
      entityType
    }

    await client.putItem(record, DDB_TABLE)

    return {
      id: _id,
      name,
      courses: undefined
    }
  }

  return {
    getTrackById,
    getTracks,
    saveTrack
  }
}
