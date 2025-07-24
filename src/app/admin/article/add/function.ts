import { articleInitialForm } from '@/constants/article/articleInitialForm'

export function handleChange(form: any, setForm: (form: any) => void) {
  return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
}

export function handleAddContent(
  form: any,
  setForm: (form: any) => void,
  contentImg: string,
  contentText: string,
  setContentImg: (v: string) => void,
  setContentText: (v: string) => void,
  setImgError: (v: boolean) => void
) {
  if (!contentImg && !contentText) return
  setForm({
    ...form,
    contents: [...form.contents, { image: contentImg, text: contentText }],
  })
  setContentImg('')
  setContentText('')
  setImgError(false)
}

export function handleRemoveContent(
  form: any,
  setForm: (form: any) => void,
  idx: number
) {
  setForm({
    ...form,
    contents: form.contents.filter((_: any, i: number) => i !== idx),
  })
}

export async function handleSubmit(
  e: React.FormEvent,
  form: any,
  setError: (v: string) => void,
  setSuccess: (v: string) => void,
  setLoading: (v: boolean) => void,
  setForm: (f: any) => void,
  setContentImg: (v: string) => void,
  setContentText: (v: string) => void,
  router: any
) {
  e.preventDefault()
  setError('')
  setSuccess('')
  setLoading(true)
  const generatedHref =
    '/article/' +
    encodeURIComponent(form.title.replace(/\s+/g, '-').toLowerCase())
  try {
    const res = await fetch('/api/article', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, href: generatedHref }),
    })
    if (!res.ok) throw new Error('Failed to add article')
    setSuccess('Article added successfully!')
    setLoading(false)
    setForm(articleInitialForm)
    setContentImg('')
    setContentText('')
    setTimeout(() => {
      router.push('/admin/article')
    }, 1200)
  } catch (err: any) {
    setError(err.message || 'Unknown error')
    setLoading(false)
  }
}
