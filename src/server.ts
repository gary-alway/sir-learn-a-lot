import 'reflect-metadata'
import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'type-graphql'
import { PreferenceResolver, StudentResolver } from './domain/studentResolver'
import { TrackResolver } from './domain/trackResolver'
import { CourseResolver } from './domain/courseResolver'
import {
  EnrollmentResolver,
  ProgressResolver
} from './domain/enrollmentResolver'
import { ChapterResolver } from './domain/chapterResolver'

async function start() {
  const app = express()

  const schema = await buildSchema({
    resolvers: [
      StudentResolver,
      TrackResolver,
      CourseResolver,
      EnrollmentResolver,
      PreferenceResolver,
      ProgressResolver,
      ChapterResolver
    ],
    emitSchemaFile: true
  })

  app.use('/graphql', graphqlHTTP({ graphiql: true, schema }))
  app.listen(9001, () => {
    console.log('server started')
  })
}

start().catch(err => {
  console.log(err)
  process.exit(1)
})
