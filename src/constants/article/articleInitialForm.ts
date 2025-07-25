import type { ArticleFormStateWithFile } from '@/types/ArticleFormState'

export const articleInitialForm: ArticleFormStateWithFile = {
  title: '',
  description: '',
  image: '',
  date: '',
  author: '',
  contents: [{ image: '', text: '', file: null }],
}
