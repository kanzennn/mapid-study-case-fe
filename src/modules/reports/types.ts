export type ReportStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface UserSummary {
  id: string
  name: string
  email: string
  picture_url: string | null
}

export interface ReportStatusHistory {
  id: string
  report_id: string
  status: ReportStatus
  approver_id: string
  approver: UserSummary
  created_at: string
}

export interface Report {
  id: string
  title: string
  description: string
  status: ReportStatus
  reporter_id: string
  reporter: UserSummary
  created_at: string
  updated_at: string

  report_status_histories: ReportStatusHistory[]
}

export interface ReportPayload {
  title: string
  description: string
}

export type ReportDecision = 'approve' | 'reject'

export type ReportSortField = 'title' | 'status' | 'created_at' | 'updated_at'

/** `-created_at` = descending, `title` = ascending. */
export type ReportSort = ReportSortField | `-${ReportSortField}`

/** Query params for `GET /reports` (filtered on the backend). */
export interface ReportListParams {
  search?: string
  status?: ReportStatus[]
  reporter_id?: string
  /** ISO date-time (inclusive). */
  created_from?: string
  /** ISO date-time (inclusive). */
  created_to?: string
  sort?: ReportSort[]
  page?: number
  limit?: number
}

/** Query params for `GET /reports/stats`: same filters as the list, minus status/sort/pagination. */
export type ReportStatsParams = Pick<ReportListParams, 'search' | 'reporter_id' | 'created_from' | 'created_to'>

export type ReportStats = Record<ReportStatus, number> & { total: number }

export const REPORT_STATUS_LABEL: Record<ReportStatus, string> = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
}
