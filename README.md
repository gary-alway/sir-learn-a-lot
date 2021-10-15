# Sir learn a lot

## todo

- readme with diagrams
- use terraform
- convert to lambda
- user preferences from learn-hub
- get student by email, sparse index on email ?
- track name must be unique
- track and course name must be unique ?

## AWS local

```
awslocal dynamodb scan --table-name sir-learn-a-lot
```

## GraphQL

[Local GraphiQL](http://localhost:3000/graphql)

Sample mutation

```
mutation addTrack {
  addTrack(TrackInput: { name:"track 1"}) {
    id
    name
  }
}

mutation addCourse {
  addCourse(CourseInput:{
    name: "course 2",
    trackId:"d7c843e0-8559-4390-bc93-f27b3f981e4a"
  }) {
    id
    name
    trackId
  }
}

query getTrack {
  getTrack(id:"d7c843e0-8559-4390-bc93-f27b3f981e4a") {
    id
    name
    courses {
      id
      name
      trackId
    }
  }
}

query getCourse {
  getCourse(id:"5eeeed69-1787-44fb-b9ef-0318512568d8") {
    id
    name
    track {
      id
      name
    }
  }
}
```
