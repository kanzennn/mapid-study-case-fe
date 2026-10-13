import { useAuth } from '@/hooks/use-auth'
import { ReportsOverview } from '@/app/dashboard/_components/reports-overview'
import { UsersOverview } from '@/app/dashboard/_components/users-overview'

export default function DashboardPage() {
  const { user } = useAuth()
  if (!user) return null

  return user.role === 'ADMIN' ? <UsersOverview user={user} /> : <ReportsOverview user={user} />
}
