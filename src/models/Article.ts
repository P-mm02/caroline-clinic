import { Schema, model, models } from 'mongoose'

const ArticleSchema = new Schema(
  {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    date: { type: String, default: '' },
    author: { type: String, default: '' },
    contents: {
      type: [
        {
          image: { type: String, default: '' },
          text: { type: String, default: '' },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
)

const Article = models.Article || model('Article', ArticleSchema, 'articles')
export default Article
