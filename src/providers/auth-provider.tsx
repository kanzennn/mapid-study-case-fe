import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import { UNAUTHORIZED_EVENT } from '@/lib/http'
import type { LoginPayload, User } from '@/modules/auth/types'
import { getCurrentUserUseCase } from '@/modules/auth/usecases/get-current-user.usecase'
import { loginUseCase } from '@/modules/auth/usecases/login.usecase'
import { logoutUseCase } from '@/modules/auth/usecases/logout.usecase'
import { AuthContext, type AuthContextValue } from '@/hooks/use-auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getCurrentUserUseCase()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))

    const handleUnauthorized = () => setUser(null)
    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
  }, [])

  const login = useCallback(async (payload: LoginPayload) => {
    const result = await loginUseCase(payload)
    setUser(result.user)
    return result.user
  }, [])

  const logout = useCallback(() => {
    logoutUseCase()
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoading, login, logout, setCurrentUser: setUser }),
    [user, isLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
