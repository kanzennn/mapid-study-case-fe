import { getReportStats } from '../repositories/report.repository'
import type { ReportStats, ReportStatsParams } from '../types'

export function getReportStatsUseCase(params: ReportStatsParams = {}): Promise<ReportStats> {
  return getReportStats({ ...params, search: params.search?.trim() || undefined })
}
