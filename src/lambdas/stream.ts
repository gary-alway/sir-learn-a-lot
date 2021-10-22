import { DynamoDBStreamEvent } from 'aws-lambda'
import { STUDENT_PREFIX } from '../domain/studentRepository'
import { removePrefix } from '../lib/utils'
import { truthy } from '../lib/truthy'
import { sqsClient, STREAM_DLQ, studentRepository } from '../constants'

export const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  try {
    const progressEvents = event.Records.map(record => {
      const data: any = record.dynamodb?.NewImage
      const entityType = data.entityType.S

      return entityType === 'progress'
        ? {
            studentId: removePrefix(data.pk.S, STUDENT_PREFIX),
            xp: Number(data.xp.N)
          }
        : undefined
    }).filter(truthy)

    await Promise.all(
      progressEvents.map(studentRepository.atomicUpdateStudentXp)
    )
  } catch (err) {
    await sqsClient.sendMessage(STREAM_DLQ, JSON.stringify({ event, err }))
  }
}
