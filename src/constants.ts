import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { courseRepositoryFactory } from './domain/courseRepository'
import { enrollmentRepositoryFactory } from './domain/enrollmentRepository'
import { preferenceRepositoryFactory } from './domain/preferenceRepository'
import { studentRepositoryFactory } from './domain/studentRepository'
import { trackRepositoryFactory } from './domain/trackRepository'
import { createDynamoClient } from './dynamoClient'

export const AWS_CONFIG = {
  region: 'us-east-1',
  accessKeyId: 'root',
  secretAccessKey: 'root',
  endpoint: 'http://localhost:4566'
}
export const DDB_TABLE = 'sir-learn-a-lot'

export const dynamoClient = createDynamoClient(new DocumentClient(AWS_CONFIG))

export const studentRepository = studentRepositoryFactory(dynamoClient)
export const trackRepository = trackRepositoryFactory(dynamoClient)
export const courseRepository = courseRepositoryFactory(dynamoClient)
export const enrollmentRepository = enrollmentRepositoryFactory(dynamoClient)
export const preferenceRepository = preferenceRepositoryFactory(dynamoClient)
