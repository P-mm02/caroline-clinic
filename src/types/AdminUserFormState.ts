import type { AdminUserType } from './AdminUserType'
import type { FormFriendly, DeepRequired } from './utils'

export type AdminUserFormState = DeepRequired<
  Omit<FormFriendly<AdminUserType>, '_id' | 'createdAt' | 'updatedAt'>
>
