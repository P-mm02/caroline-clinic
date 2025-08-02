export type ArticleType = {
  _id: string
  title: string
  description: string
  image: string
  date: string
  author: string
  contents: { image: string; text: string}[]
}
