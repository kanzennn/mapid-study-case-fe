import { createContext, useContext } from 'react'
import type { LoginPayload, User } from '@/modules/auth/types'

export interface AuthContextValue {
  user: User | null
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<User>
  logout: () => void
  /** Sync the signed-in user after their profile is updated. */
  setCurrentUser: (user: User) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
