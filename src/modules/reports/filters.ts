import type { ReportListParams, ReportSort, ReportStatsParams, ReportStatus } from './types'

export type ReportStatusFilter = ReportStatus | 'ALL'

export interface ReportFilterValues {
  search: string
  status: ReportStatusFilter
  sort: ReportSort
  /** Local calendar date `YYYY-MM-DD`, or empty. */
  from: string
  /** Local calendar date `YYYY-MM-DD`, or empty. */
  to: string
}

export interface ReportListState extends ReportFilterValues {
  page: number
  limit: number
}

export const DEFAULT_REPORT_FILTERS: ReportFilterValues = {
  search: '',
  status: 'ALL',
  sort: '-created_at',
  from: '',
  to: '',
}

export const DEFAULT_REPORT_PAGE_SIZE = 10

export const REPORT_STATUS_FILTERS: ReportStatusFilter[] = ['ALL', 'PENDING', 'APPROVED', 'REJECTED']
const SORTS: ReportSort[] = ['-created_at', 'created_at', 'title', '-title', '-updated_at']
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

const positiveInt = (value: string | null, fallback: number) => {
  const n = Number(value)
  return Number.isInteger(n) && n > 0 ? n : fallback
}

const dateParam = (value: string | null) => (value && DATE_ONLY.test(value) ? value : '')

/** Read the filter state from the URL (`?q=&status=&sort=&from=&to=&page=&limit=`), ignoring unknown values. */
export function readReportListState(params: URLSearchParams): ReportListState {
  const status = params.get('status') as ReportStatusFilter | null
  const sort = params.get('sort') as ReportSort | null
  let from = dateParam(params.get('from'))
  let to = dateParam(params.get('to'))
  // A reversed range (e.g. typed into the URL) is swapped instead of failing.
  if (from && to && from > to) [from, to] = [to, from]

  return {
    search: params.get('q') ?? DEFAULT_REPORT_FILTERS.search,
    status: status && REPORT_STATUS_FILTERS.includes(status) ? status : DEFAULT_REPORT_FILTERS.status,
    sort: sort && SORTS.includes(sort) ? sort : DEFAULT_REPORT_FILTERS.sort,
    from,
    to,
    page: positiveInt(params.get('page'), 1),
    limit: positiveInt(params.get('limit'), DEFAULT_REPORT_PAGE_SIZE),
  }
}

/** Write the state to the URL; default values are omitted to keep the URL short. */
export function writeReportListState(state: ReportListState): URLSearchParams {
  const params = new URLSearchParams()
  if (state.search) params.set('q', state.search)
  if (state.status !== DEFAULT_REPORT_FILTERS.status) params.set('status', state.status)
  if (state.sort !== DEFAULT_REPORT_FILTERS.sort) params.set('sort', state.sort)
  if (state.from) params.set('from', state.from)
  if (state.to) params.set('to', state.to)
  if (state.page !== 1) params.set('page', String(state.page))
  if (state.limit !== DEFAULT_REPORT_PAGE_SIZE) params.set('limit', String(state.limit))
  return params
}

export function isReportFilterActive(state: ReportFilterValues) {
  return Boolean(state.search || state.from || state.to) || state.status !== DEFAULT_REPORT_FILTERS.status
}

/**
 * Local calendar dates become full ISO timestamps in the user's timezone, so
 * "Oct 13" means Oct 13 00:00-23:59 local time rather than UTC.
 */
const startOfLocalDay = (date: string) => (date ? new Date(`${date}T00:00:00`).toISOString() : undefined)
const endOfLocalDay = (date: string) => (date ? new Date(`${date}T23:59:59.999`).toISOString() : undefined)

/** Params for `GET /reports/stats` (status tabs counts follow the other filters). */
export function toReportStatsParams(state: ReportFilterValues): ReportStatsParams {
  return {
    search: state.search || undefined,
    created_from: startOfLocalDay(state.from),
    created_to: endOfLocalDay(state.to),
  }
}

/** Convert the UI state into `GET /reports` query params. */
export function toReportListParams(state: ReportListState): ReportListParams {
  return {
    ...toReportStatsParams(state),
    status: state.status === 'ALL' ? undefined : [state.status],
    sort: [state.sort],
    page: state.page,
    limit: state.limit,
  }
}
