import {
  DDB_TABLE,
  dynamoClient,
  sqsClient,
  STREAM_DLQ
} from '../src/constants'

Promise.all([dynamoClient.truncateTable(DDB_TABLE, 'pk', 'sk')])
  .then(async () => {
    await sqsClient.purgeQueue(STREAM_DLQ)
  })
  .then(() => process.exit(0))
  .catch(err => {
    console.log(err)
    process.exit(1)
  })
