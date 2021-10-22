import { DynamoDBStreamEvent } from 'aws-lambda'
import { sqsClient, STREAM_DLQ, studentRepository } from '../constants'

export const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  try {
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
