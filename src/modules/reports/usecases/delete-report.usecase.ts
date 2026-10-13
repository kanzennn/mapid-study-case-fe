import { deleteReport } from '../repositories/report.repository'
import type { Report } from '../types'

export function deleteReportUseCase(report: Report): Promise<void> {
  if (report.status !== 'PENDING') {
    throw new Error('A report can only be deleted while it is pending')
  }
  return deleteReport(report.id)
}
