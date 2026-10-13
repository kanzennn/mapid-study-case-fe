import { getReportById } from '../repositories/report.repository'
import type { Report } from '../types'

export function getReportDetailUseCase(id: string): Promise<Report> {
  return getReportById(id)
}
