import 'reflect-metadata'
import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'type-graphql'
import { StudentResolver } from './domain/studentResolver'

async function start() {
  const app = express()

  const schema = await buildSchema({
    resolvers: [StudentResolver],
    emitSchemaFile: true
  })

  app.use('/graphql', graphqlHTTP({ graphiql: true, schema }))
  app.listen(3000, () => {
    console.log('server started')
  })
}

start().catch(err => {
  console.log(err)
  process.exit(1)
})
