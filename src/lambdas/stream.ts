import { DynamoDBStreamEvent } from 'aws-lambda'
import { pushStream } from 'dynamodb-stream-elasticsearch'
import {
  ELASTICSEARCH_URL,
  ELASTICSEARCH_INDEX,
  sqsClient,
  STREAM_DLQ,
  studentRepository
} from '../constants'

export const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  try {
    await pushStream({
      event,
      endpoint: ELASTICSEARCH_URL,
      index: ELASTICSEARCH_INDEX
    })

    for (let i = 0; i < event.Records.length; i++) {
      const record = event.Records[i]

      const data: any = record.dynamodb?.NewImage
      const entityType = data.entityType.S

      if (entityType === 'progress') {
        const studentId = (data.pk.S as string).split('#')[1]
        const xp = Number(data.xp.N)
        await studentRepository.atomicUpdateStudentXp({ studentId, xp })
      }
    }
  } catch (err) {
    await sqsClient.sendMessage(STREAM_DLQ, JSON.stringify({ event, err }))
  }
}
