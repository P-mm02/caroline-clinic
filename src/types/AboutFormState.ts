import type { AboutType } from './AboutType'
import type { FormFriendly, DeepRequired } from './utils'

export type AboutFormState = DeepRequired<
  Omit<FormFriendly<AboutType>, '_id' | 'createdAt' | 'updatedAt' | '__v'>
>

// Enhanced version with local-only "files" (optional)
export type AboutFormStateWithFiles = AboutFormState & {
  aboutImageFiles?: (File | null)[]
}
