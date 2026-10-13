import type { Paginated } from '@/lib/http'
import { getReports } from '../repositories/report.repository'
import type { Report, ReportListParams } from '../types'

export function getReportsUseCase(params: ReportListParams = {}): Promise<Paginated<Report[]>> {
  return getReports({ ...params, search: params.search?.trim() || undefined })
}
