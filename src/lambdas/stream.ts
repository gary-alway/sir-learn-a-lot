import { DynamoDBStreamEvent } from 'aws-lambda'

export const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  event.Records.map(record => console.log(JSON.stringify(record)))
}
