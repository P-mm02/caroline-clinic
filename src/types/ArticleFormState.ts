import type { ArticleType } from './ArticleType'
import type { FormFriendly, DeepRequired } from './utils'

export type ArticleFormState = DeepRequired<
  Omit<FormFriendly<ArticleType>, '_id' | 'createdAt' | 'updatedAt' | '__v'>
>

// Enhanced version with local-only "file"
export type ArticleFormStateWithFile = Omit<ArticleFormState, 'contents'> & {
  contents: (ArticleFormState['contents'][number] & {
    file?: File | null
  })[]
}
