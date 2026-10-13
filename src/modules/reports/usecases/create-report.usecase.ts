import { createReport } from '../repositories/report.repository'
import type { Report, ReportPayload } from '../types'
import { validateReportPayload } from '../validations/report.validation'

export function createReportUseCase(payload: ReportPayload): Promise<Report> {
  return createReport(validateReportPayload(payload))
}
