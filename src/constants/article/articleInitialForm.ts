import type { ArticleFormStateWithFile } from '@/types/ArticleFormState'

export const articleInitialForm: ArticleFormStateWithFile = {
  title: '',
  description: '',
  image: '',
  coverFile: null,
  date: '',
  author: '',
  contents: [{ image: '', text: '', file: null }],
}
