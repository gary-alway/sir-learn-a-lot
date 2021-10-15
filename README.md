# Sir learn a lot

## todo

- use terraform
- convert to lambda

## AWS local

```
awslocal dynamodb scan --table-name sir-learn-a-lot
```

## GraphQL

[Local GraphiQL](http://localhost:3000/graphql)

```
mutation {
  addStudent(StudentInput: {firstname: "Gary", lastname:"Alway"}) {
    id
    firstname
    lastname
  }
}
```
