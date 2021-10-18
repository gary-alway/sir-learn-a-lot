import { DynamoClient } from '../dynamoClient'
import { DDB_TABLE } from '../constants'
import { addPrefix, removePrefix } from '../utils'
import { Preference, PreferenceInput } from './preference'
import { STUDENT_PREFIX } from './studentRepository'
import { TRACK_PREFIX } from './trackRepository'
import { QueryInput } from 'aws-sdk/clients/dynamodb'
import { pathOr } from 'ramda'

export const PREFERENCE_PREFIX = 'p#'
const entityType = 'preference'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamoRecordToRecord = (record: any): Preference => {
  const { pk, sk } = record

  return {
    studentId: removePrefix(pk, STUDENT_PREFIX),
    trackId: removePrefix(sk, PREFERENCE_PREFIX)
  } as Preference
}

export const preferenceRepositoryFactory = (client: DynamoClient) => {
  const getStudentPreferences = async (
    studentId: string
  ): Promise<Preference[]> =>
    client
      .query({
        TableName: DDB_TABLE,
        KeyConditionExpression: '#pk = :pk and begins_with (#sk, :sk)',
        ExpressionAttributeNames: {
          '#pk': 'pk',
          '#sk': 'sk'
        },
        ExpressionAttributeValues: {
          ':pk': addPrefix(studentId, STUDENT_PREFIX),
          ':sk': PREFERENCE_PREFIX
        }
      } as QueryInput)
      .then(res =>
        pathOr<Preference[]>([], ['Items'], res).map(dynamoRecordToRecord)
      )

  const savePreference = async ({
    studentId,
    trackId
  }: PreferenceInput): Promise<Preference> => {
    const _studentId = removePrefix(studentId, STUDENT_PREFIX)
    const _trackId = removePrefix(trackId, TRACK_PREFIX)

    const record = {
      pk: addPrefix(_studentId, STUDENT_PREFIX),
      sk: addPrefix(_trackId, PREFERENCE_PREFIX),
      entityType
    }

    await client.putItem(record, DDB_TABLE)

    return {
      studentId: _studentId,
      trackId: _trackId,
      student: undefined,
      track: undefined
    }
  }

  return {
    getStudentPreferences,
    savePreference
  }
}
