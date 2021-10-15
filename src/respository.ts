const authors: Author[] = [
    { id: 1, name: 'burt' },
    { id: 2, name: 'brian' },
    { id: 3, name: 'betty' }
]

const books: Book[] = [
    { id: 1, title: 'my book', authorId: 1 },
    { id: 2, title: 'my book 2', authorId: 1 }
]

export const getAuthors = async () => Promise.resolve(authors)

export const getAuthor = async (id: number) => Promise.resolve(authors.find(a => a.id === id))

export const getBooks = async () => Promise.resolve(books)

export const getBook = async (id: number) => Promise.resolve(books.find(b => b.id === id))

export const getBooksByAuthor = async (authorId: number) => Promise.resolve(books.filter(b => b.authorId === authorId))

export const addBook = async (title: string, authorId: number): Promise<Book> => {
    const id = books.length + 1
    const newBook = { id, title, authorId }
    books.push(newBook)
    return Promise.resolve(newBook)
}