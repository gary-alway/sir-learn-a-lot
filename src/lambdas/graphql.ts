import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-lambda'
import { buildSchema } from 'type-graphql'
import { APIGatewayEvent, Context, Callback } from 'aws-lambda'
import { ChapterResolver } from '../domain/chapterResolver'
import { CourseResolver } from '../domain/courseResolver'
import {
  EnrollmentResolver,
  ProgressResolver
} from '../domain/enrollmentResolver'
import { StudentResolver, PreferenceResolver } from '../domain/studentResolver'
import { TrackResolver } from '../domain/trackResolver'

export async function handler(
  event: APIGatewayEvent,
  context: Context,
  callback: Callback
) {
  function callbackWithHeaders(
    error: string | Error | null | undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    output: any
  ) {
    output.headers['Access-Control-Allow-Origin'] = '*'
    callback(error, output)
  }

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

  const server = new ApolloServer({
    schema,
    introspection: true
  })

  const handler = server.createHandler()
  return handler(event, context, callbackWithHeaders)
}
