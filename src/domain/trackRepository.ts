import { omit } from 'ramda'
import { DynamoClient } from '../dynamoClient'
import { DDB_TABLE } from '../constants'
import { v4 as uuidv4 } from 'uuid'
import { addPrefix, removePrefix } from '../utils'
import { Track, TrackInput } from './track'
import { DynamoDB } from 'aws-sdk'

export const TRACK_PREFIX = 't#'
const entityType = 'track'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamoRecordToRecord = (record: any): Track => {
  const { pk, ...data } = record

  return omit(['sk', 'entityType'], {
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

  const saveTrack = async (
    { name }: TrackInput,
    id?: string
  ): Promise<Track> => {
    const _id = id ? removePrefix(id, TRACK_PREFIX) : uuidv4()

    const record = {
      pk: addPrefix(_id, TRACK_PREFIX),
      sk: addPrefix(_id, TRACK_PREFIX),
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
    getTrackById,
    saveTrack
  }
}
