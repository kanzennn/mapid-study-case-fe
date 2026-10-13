export type UserRole = 'ADMIN' | 'APPROVER' | 'REPORTER'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  is_active: boolean
  created_at: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResult {
  user: User
  token: string
}

export const ROLE_LABEL: Record<UserRole, string> = {
  ADMIN: 'Admin',
  APPROVER: 'Approver',
  REPORTER: 'Reporter',
}
