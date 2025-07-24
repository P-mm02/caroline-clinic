import type { ArticleType } from '@/types/ArticleType'

export const articleInitialForm: Omit<ArticleType, 'href'> & { href?: string } =
  {
    title: '',
    description: '',
    image: '',
    date: '',
    author: '',
    contents: [],
  }
