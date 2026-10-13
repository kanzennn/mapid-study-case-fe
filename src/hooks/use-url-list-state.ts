import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const SEARCH_DEBOUNCE_MS = 300

interface ListState {
  search: string
  page: number
}

interface UrlListStateOptions<T extends ListState> {
  read: (params: URLSearchParams) => T
  write: (state: T) => URLSearchParams
}

/**
 * Keeps a list page's filter/sort/pagination state in the URL query string.
 *
 * - Any filter change resets to page 1 (unless `page` itself is being set).
 * - The search box is typed into locally and pushed to the URL after a short pause.
 * - Several updates in the same tick are merged instead of overwriting each other.
 */
export function useUrlListState<T extends ListState>({ read, write }: UrlListStateOptions<T>) {
  const [searchParams, setSearchParams] = useSearchParams()
  const state = useMemo(() => read(searchParams), [read, searchParams])

  // Latest params including updates not rendered yet; react-router's functional updater
  // only sees the last rendered params, so back-to-back updates would otherwise be lost.
  const latestParams = useRef(searchParams)
  useEffect(() => {
    latestParams.current = searchParams
  }, [searchParams])

  const [searchInput, setSearchInput] = useState(state.search)
  const searchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(searchTimer.current), [])

  const update = useCallback(
    (patch: Partial<T>) => {
      const next = write({ ...read(latestParams.current), page: 1, ...patch })
      latestParams.current = next
      setSearchParams(next, { replace: true })
    },
    [read, write, setSearchParams],
  )

  /** Like `update`, but a `search` change is debounced. */
  const updateFilters = useCallback(
    (patch: Partial<T>) => {
      if (patch.search === undefined) {
        update(patch)
        return
      }
      const search = patch.search
      setSearchInput(search)
      clearTimeout(searchTimer.current)
      searchTimer.current = setTimeout(() => update({ search: search.trim() } as Partial<T>), SEARCH_DEBOUNCE_MS)
    },
    [update],
  )

  const reset = useCallback(() => {
    clearTimeout(searchTimer.current)
    setSearchInput('')
    latestParams.current = new URLSearchParams()
    setSearchParams(latestParams.current, { replace: true })
  }, [setSearchParams])

  return { state, searchInput, update, updateFilters, reset }
}
