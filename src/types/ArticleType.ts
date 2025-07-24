export type ArticleType = {
  title: string
  description: string
  image: string
  date: string
  author: string
  href: string
  contents: { image: string; text: string }[] // <--
}
