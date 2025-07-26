import PageClient from './pageClient'

type ArticlePageProps = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: ArticlePageProps) {
  const { id } = await params
  return <PageClient id={id} />
}
