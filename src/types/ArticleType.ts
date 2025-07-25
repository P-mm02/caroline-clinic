export type ArticleType = {
  _id: string // ← Add this
  title: string
  description: string
  image: string
  date: string
  author: string
  contents: { image: string; text: string}[]
}
