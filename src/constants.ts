import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { studentRepositoryFactory } from './domain/studentRepository'
import { createDynamoClient } from './dynamoClient'

export const AWS_CONFIG = {
  region: 'us-east-1',
  accessKeyId: 'root',
  secretAccessKey: 'root',
  endpoint: 'http://localhost:4566'
}
export const DDB_TABLE = 'sir-learn-a-lot'

const dynamoClient = createDynamoClient(new DocumentClient(AWS_CONFIG))

export const studentRepository = studentRepositoryFactory(dynamoClient)
