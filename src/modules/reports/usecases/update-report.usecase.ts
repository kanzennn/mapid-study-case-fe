import { updateReport } from '../repositories/report.repository'
import type { Report, ReportPayload } from '../types'
import { validateReportPayload } from '../validations/report.validation'

export function updateReportUseCase(report: Report, payload: ReportPayload): Promise<Report> {
  if (report.status !== 'PENDING') {
    throw new Error('A report can only be edited while it is pending')
  }
  return updateReport(report.id, validateReportPayload(payload))
}
