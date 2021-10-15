import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql'
import { addBook, getAuthor, getAuthors, getBook, getBooks, getBooksByAuthor } from './respository'

const app = express()

const BookType: any = new GraphQLObjectType({
  name: 'book',
  description: 'a book',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    title: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType, resolve: ({ authorId }: Book) => {
        return getAuthor(authorId)
      }
    }
  })
})

const AuthorType: any = new GraphQLObjectType({
  name: 'author',
  description: 'an author',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: GraphQLList(BookType), resolve: ({ id }: Author) => {
        return getBooksByAuthor(id)
      }
    }
  })
})

const mutation = new GraphQLObjectType({
  name: 'mutation',
  description: 'root mutation',
  fields: () => ({
    addBook: {
      type: BookType, description: 'adds a book', args: {
        title: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (_, args) => addBook(args.title, args.authorId)
    }
  })
})

const query = new GraphQLObjectType({
  name: 'query',
  description: 'root query',
  fields: () => ({
    books: {
      type: new GraphQLList(BookType),
      description: 'list of all books',
      resolve: () => getBooks()
    },
    book: {
      type: BookType,
      description: 'a single book',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (_, args) => getBook(args.id)
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: 'list of all authors',
      resolve: () => getAuthors()
    },
    author: {
      type: AuthorType,
      description: 'a single author',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (_, args) => getAuthor(args.id)
    }
  })
})

const schema = new GraphQLSchema({ query, mutation })
app.use('/graphql', graphqlHTTP({ graphiql: true, schema }))
app.listen(3000, () => {
  console.log('server started')
})
