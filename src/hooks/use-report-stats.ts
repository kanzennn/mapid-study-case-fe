import { useCallback, useEffect, useRef, useState } from 'react'

import { getErrorMessage } from '@/lib/http'
import type { ReportStats, ReportStatsParams } from '@/modules/reports/types'
import { getReportStatsUseCase } from '@/modules/reports/usecases/get-report-stats.usecase'

const EMPTY: ReportStats = { total: 0, PENDING: 0, APPROVED: 0, REJECTED: 0 }

/** Report counts per status for the given filters. */
export function useReportStats(params: ReportStatsParams = {}) {
  const [stats, setStats] = useState<ReportStats>(EMPTY)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const latestRequest = useRef(0)

  const key = JSON.stringify(params)

  const refresh = useCallback(async () => {
    const requestId = ++latestRequest.current
    setError(null)
    try {
      const result = await getReportStatsUseCase(JSON.parse(key) as ReportStatsParams)
      if (requestId === latestRequest.current) setStats(result)
    } catch (err) {
      if (requestId === latestRequest.current) setError(getErrorMessage(err))
    } finally {
      if (requestId === latestRequest.current) setIsLoading(false)
    }
  }, [key])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- refetch when filters change
    refresh()
  }, [refresh])

  return { stats, isLoading, error, refresh }
}
