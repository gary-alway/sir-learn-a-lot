# Sir learn a lot

## todo

- readme with diagrams
- use terraform
- convert to lambda
- user preferences from learn-hub

## AWS local

```
awslocal dynamodb scan --table-name sir-learn-a-lot
```

## GraphQL

[Local GraphiQL](http://localhost:3000/graphql)

Sample mutation

```
mutation {
  addStudent(StudentInput: {firstname: "Gary", lastname:"Alway"}) {
    id
    firstname
    lastname
  }
}
```

Sample query

```
query {
  getStudent(id: "fde608b0-afd7-4399-bf7d-c2295f6a89ff") {
    id
    firstname
    lastname
  }
}
```
