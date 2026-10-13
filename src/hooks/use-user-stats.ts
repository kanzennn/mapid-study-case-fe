import { useCallback, useEffect, useState } from 'react'

import { getErrorMessage } from '@/lib/http'
import type { UserStats } from '@/modules/users/types'
import { getUserStatsUseCase } from '@/modules/users/usecases/get-user-stats.usecase'

const EMPTY: UserStats = { total: 0, active: 0, reporters: 0, approvers: 0 }

export function useUserStats() {
  const [stats, setStats] = useState<UserStats>(EMPTY)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setError(null)
    try {
      setStats(await getUserStatsUseCase())
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch
    refresh()
  }, [refresh])

  return { stats, isLoading, error, refresh }
}
