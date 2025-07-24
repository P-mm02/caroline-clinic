import type { ArticleType } from './ArticleType'
import type { FormFriendly, DeepRequired } from './utils'

export type ArticleFormState = DeepRequired<
  Omit<FormFriendly<ArticleType>, '_id' | 'createdAt' | 'updatedAt' | '__v'>
>
