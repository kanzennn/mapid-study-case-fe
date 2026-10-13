import { useCallback } from 'react'
import { ArrowRightIcon, FileTextIcon, ShieldCheckIcon, UserCheckIcon, UsersIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ErrorState } from '@/components/shared/error-state'
import { PageHeader } from '@/components/shared/page-header'
import { StatCard } from '@/components/shared/stat-card'
import { Button } from '@/components/ui/button'
import { ROLE_LABEL } from '@/modules/auth/types'
import { useUserStats } from '@/hooks/use-user-stats'
import { useUsers } from '@/hooks/use-users'
import type { User } from '@/modules/users/types'
import { UsersTable } from '@/components/users/users-table'

const RECENT_LIMIT = 5

/** Dashboard overview for Admins. */
export function UsersOverview({ user }: { user: User }) {
  const { stats, isLoading: isStatsLoading, refresh: refreshStats } = useUserStats()
  const { users, isLoading, error, refresh: refreshUsers } = useUsers({ sort: ['-created_at'], limit: RECENT_LIMIT })

  const refresh = useCallback(() => {
    refreshStats()
    refreshUsers()
  }, [refreshStats, refreshUsers])

  return (
    <>
      <PageHeader
        title={`Hi, ${user.name}`}
        description={`Signed in as ${ROLE_LABEL[user.role]}. Manage the user accounts of the reporting system.`}
        actions={
          <Button nativeButton={false} render={<Link to="/dashboard/users" />}>
            <UsersIcon data-icon="inline-start" />
            Manage users
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users" value={stats.total} icon={UsersIcon} tone="indigo" isLoading={isStatsLoading} />
        <StatCard label="Active accounts" value={stats.active} icon={UserCheckIcon} tone="emerald" isLoading={isStatsLoading} />
        <StatCard label="Reporters" value={stats.reporters} icon={FileTextIcon} tone="amber" isLoading={isStatsLoading} />
        <StatCard label="Approvers" value={stats.approvers} icon={ShieldCheckIcon} isLoading={isStatsLoading} />
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Newest users</h3>
          <Button variant="ghost" size="sm" nativeButton={false} render={<Link to="/dashboard/users" />}>
            View all
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
        {error ? (
          <ErrorState message={error} onRetry={refresh} />
        ) : (
          <UsersTable
            currentUser={user}
            users={users}
            isLoading={isLoading}
            onChanged={refresh}
          />
        )}
      </section>
    </>
  )
}
