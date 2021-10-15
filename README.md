# sir learn a lot

todo


```
mutation addANewBook {
  addBook(title:"my new book", authorId:1) {
    title
    id
    authorId
  }
}

query demo {
  book(id: 1) {
    title
  }
  author(id: 1) {
    name
  }
  books {
    id
    title
    author {
      name
    }
  }
  authors {
    id
    name
    books {
      title
    }
  }
}
```