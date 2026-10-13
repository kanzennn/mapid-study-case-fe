import type { UserRole } from '@/modules/auth/types'

export type { User, UserRole } from '@/modules/auth/types'

export interface CreateUserPayload {
  name: string
  email: string
  password: string
  role: UserRole
}

export type UpdateUserPayload = Partial<CreateUserPayload>

export type UserSortField = 'name' | 'email' | 'role' | 'is_active' | 'created_at' | 'updated_at'

/** `-created_at` = descending, `name` = ascending. */
export type UserSort = UserSortField | `-${UserSortField}`

/** Query params for `GET /users` (filtered on the backend). */
export interface UserListParams {
  search?: string
  role?: UserRole[]
  is_active?: boolean
  created_from?: string
  created_to?: string
  sort?: UserSort[]
  page?: number
  limit?: number
}

export interface UserStats {
  total: number
  active: number
  reporters: number
  approvers: number
}
