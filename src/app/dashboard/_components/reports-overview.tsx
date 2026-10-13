import { useCallback, useState } from 'react'
import { ArrowRightIcon, CircleCheckIcon, CircleXIcon, ClockIcon, FileTextIcon, PlusIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ErrorState } from '@/components/shared/error-state'
import { PageHeader } from '@/components/shared/page-header'
import { StatCard } from '@/components/shared/stat-card'
import { Button } from '@/components/ui/button'
import type { User } from '@/modules/auth/types'
import { useReportStats } from '@/hooks/use-report-stats'
import { useReports } from '@/hooks/use-reports'
import { reportPermissions } from '@/modules/reports/permissions'
import { ReportFormDialog } from '@/components/reports/report-form-dialog'
import { ReportsTable } from '@/components/reports/reports-table'

const RECENT_LIMIT = 5

/** Dashboard overview for Reporters & Approvers. */
export function ReportsOverview({ user }: { user: User }) {
  const { stats, isLoading: isStatsLoading, refresh: refreshStats } = useReportStats()
  const { reports, isLoading, error, refresh: refreshReports } = useReports({ sort: ['-created_at'], limit: RECENT_LIMIT })
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const refresh = useCallback(() => {
    refreshStats()
    refreshReports()
  }, [refreshStats, refreshReports])

  const isReporter = user.role === 'REPORTER'

  return (
    <>
      <PageHeader
        title={`Hi, ${user.name}`}
        description={
          isReporter
            ? 'An overview of the reports you have submitted.'
            : 'An overview of all reports to review and already reviewed.'
        }
        actions={
          reportPermissions.canCreate(user) && (
            <Button onClick={() => setIsCreateOpen(true)}>
              <PlusIcon data-icon="inline-start" />
              New report
            </Button>
          )
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total reports" value={stats.total} icon={FileTextIcon} tone="indigo" isLoading={isStatsLoading} />
        <StatCard
          label="Pending"
          value={stats.PENDING}
          icon={ClockIcon}
          tone="amber"
          hint={isReporter ? 'Awaiting review' : 'Needs review'}
          isLoading={isStatsLoading}
        />
        <StatCard label="Approved" value={stats.APPROVED} icon={CircleCheckIcon} tone="emerald" isLoading={isStatsLoading} />
        <StatCard label="Rejected" value={stats.REJECTED} icon={CircleXIcon} tone="red" isLoading={isStatsLoading} />
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Latest reports</h3>
          <Button variant="ghost" size="sm" nativeButton={false} render={<Link to="/dashboard/reports" />}>
            View all
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
        {error ? (
          <ErrorState message={error} onRetry={refresh} />
        ) : (
          <ReportsTable
            user={user}
            reports={reports}
            isLoading={isLoading}
            onChanged={refresh}
            emptyMessage={isReporter ? "You haven't submitted any reports yet." : 'No reports have come in yet.'}
          />
        )}
      </section>

      <ReportFormDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} onSaved={refresh} />
    </>
  )
}
