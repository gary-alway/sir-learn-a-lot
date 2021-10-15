import { DDB_TABLE, dynamoClient } from '../src/constants'

export const purgeAll = async () =>
  Promise.all([dynamoClient.truncateTable(DDB_TABLE, 'pk', 'sk')])

purgeAll()
  .then(() => process.exit(0))
  .catch(err => {
    console.log(err)
    process.exit(1)
  })
