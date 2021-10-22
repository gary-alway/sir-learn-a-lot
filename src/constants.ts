import { SQS } from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { chapterRepositoryFactory } from './domain/chapterRepository'
import { courseRepositoryFactory } from './domain/courseRepository'
import { enrollmentRepositoryFactory } from './domain/enrollmentRepository'
import { preferenceRepositoryFactory } from './domain/preferenceRepository'
import { progressRepositoryFactory } from './domain/progressRepository'
import { studentRepositoryFactory } from './domain/studentRepository'
import { trackRepositoryFactory } from './domain/trackRepository'
import { createDynamoClient } from './lib/dynamoClient'
import { createSQSClient } from './lib/sqsClient'

export const AWS_CONFIG = {
  region: 'us-east-1',
  accessKeyId: 'root',
  secretAccessKey: 'root',
  endpoint: 'http://localhost:4566'
}
export const DDB_TABLE = 'sir-learn-a-lot'
export const STREAM_DLQ = 'http://localhost:4566/000000000000/stream-dlq'

export const dynamoClient = createDynamoClient(new DocumentClient(AWS_CONFIG))
export const sqsClient = createSQSClient(new SQS(AWS_CONFIG))

export const studentRepository = studentRepositoryFactory(dynamoClient)
export const trackRepository = trackRepositoryFactory(dynamoClient)
export const courseRepository = courseRepositoryFactory(dynamoClient)
export const enrollmentRepository = enrollmentRepositoryFactory(dynamoClient)
export const preferenceRepository = preferenceRepositoryFactory(dynamoClient)
export const chapterRepository = chapterRepositoryFactory(dynamoClient)
export const progressRepository = progressRepositoryFactory(dynamoClient)
