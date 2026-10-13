import { useCallback, useEffect, useState } from 'react'
import { PlusIcon } from 'lucide-react'

import { ReportFormDialog } from '@/components/reports/report-form-dialog'
import { ReportsTable } from '@/components/reports/reports-table'
import { ErrorState } from '@/components/shared/error-state'
import { PageHeader } from '@/components/shared/page-header'
import { PaginationBar } from '@/components/shared/pagination-bar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useReportStats } from '@/hooks/use-report-stats'
import { useReports } from '@/hooks/use-reports'
import { useUrlListState } from '@/hooks/use-url-list-state'
import { cn } from '@/lib/utils'
import {
  isReportFilterActive,
  readReportListState,
  toReportListParams,
  toReportStatsParams,
  writeReportListState,
} from '@/modules/reports/filters'
import { reportPermissions } from '@/modules/reports/permissions'
import { ReportsFilters } from './_components/reports-filters'

export default function ReportsPage() {
  const { user } = useAuth()
  const { state, searchInput, update, updateFilters, reset } = useUrlListState({
    read: readReportListState,
    write: writeReportListState,
  })

  const { reports, meta, isLoading, isFetching, error, refresh: refreshReports } = useReports(toReportListParams(state))
  const { stats, refresh: refreshStats } = useReportStats(toReportStatsParams(state))

  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const refresh = useCallback(() => {
    refreshReports()
    refreshStats()
  }, [refreshReports, refreshStats])

  // If the current page becomes empty (e.g. after deleting its last item), step back to the last page.
  useEffect(() => {
    if (meta && meta.total > 0 && state.page > meta.total_pages) {
      update({ page: meta.total_pages })
    }
  }, [meta, state.page, update])

  if (!user) return null

  const isReporter = user.role === 'REPORTER'

  return (
    <>
      <PageHeader
        title="Reports"
        description={
          isReporter
            ? 'Reports you have submitted. A report can be edited while it is still pending.'
            : 'Review reports and approve or reject them.'
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

      <ReportsFilters
        values={{ ...state, search: searchInput }}
        stats={stats}
        searchPlaceholder={isReporter ? 'Search title or description...' : 'Search title, description, reporter...'}
        onChange={updateFilters}
        onReset={reset}
      />

      {error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : (
        <div className="space-y-3">
          <div
            aria-busy={isFetching}
            className={cn('transition-opacity', isFetching && !isLoading && 'pointer-events-none opacity-60')}
          >
            <ReportsTable
              user={user}
              reports={reports}
              isLoading={isLoading}
              onChanged={refresh}
              emptyMessage={isReportFilterActive(state) ? 'No reports match the current filters.' : undefined}
            />
          </div>
          {meta && (
            <PaginationBar
              meta={meta}
              disabled={isFetching}
              onPageChange={(page) => update({ page })}
              onLimitChange={(limit) => update({ limit })}
            />
          )}
        </div>
      )}

      <ReportFormDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} onSaved={refresh} />
    </>
  )
}
