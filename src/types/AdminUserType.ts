// src/types/AdminUserType.ts
export type AdminUserType = {
  _id: string
  username: string
  email?: string
  password: string
  avatarUrl?: string
  role: 'superadmin' | 'admin' | 'operator' | 'viewer'
  active: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
}
