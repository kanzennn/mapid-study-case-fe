import { Loader2Icon } from 'lucide-react'
import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '@/hooks/use-auth'
import type { UserRole } from '@/modules/auth/types'

function FullPageLoader() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
    </div>
  )
}

export function RequireAuth() {
  const { user, isLoading } = useAuth()

  if (isLoading) return <FullPageLoader />
  if (!user) return <Navigate to="/auth/login" replace />
  return <Outlet />
}

export function GuestOnly() {
  const { user, isLoading } = useAuth()

  if (isLoading) return <FullPageLoader />
  if (user) return <Navigate to="/dashboard" replace />
  return <Outlet />
}

export function RequireRole({ roles }: { roles: UserRole[] }) {
  const { user } = useAuth()

  if (!user || !roles.includes(user.role)) return <Navigate to="/dashboard" replace />
  return <Outlet />
}
