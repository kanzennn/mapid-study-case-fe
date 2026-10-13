import { useCallback, useEffect, useRef, useState } from 'react'

import { getErrorMessage, type PaginationMeta } from '@/lib/http'
import type { Report, ReportListParams } from '@/modules/reports/types'
import { getReportsUseCase } from '@/modules/reports/usecases/get-reports.usecase'

/**
 * Fetch reports from the backend for the given filters. Previous data stays visible
 * while the next fetch runs (`isFetching`) so the table does not flicker.
 */
export function useReports(params: ReportListParams = {}) {
  const [reports, setReports] = useState<Report[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Only the latest request may update state, so a slow stale response can't overwrite newer results.
  const latestRequest = useRef(0)

  // Serialize so a new params object with the same contents does not trigger a refetch.
  const key = JSON.stringify(params)

  const refresh = useCallback(async () => {
    const requestId = ++latestRequest.current
    setIsFetching(true)
    setError(null)
    try {
      const result = await getReportsUseCase(JSON.parse(key) as ReportListParams)
      if (requestId !== latestRequest.current) return
      setReports(result.data)
      setMeta(result.meta)
    } catch (err) {
      if (requestId !== latestRequest.current) return
      setError(getErrorMessage(err))
    } finally {
      if (requestId === latestRequest.current) {
        setIsLoading(false)
        setIsFetching(false)
      }
    }
  }, [key])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- refetch when filters change
    refresh()
  }, [refresh])

  return { reports, meta, isLoading, isFetching, error, refresh }
}
