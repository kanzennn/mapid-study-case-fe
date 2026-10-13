import { decideReport } from '../repositories/report.repository'
import type { Report, ReportDecision } from '../types'

export function decideReportUseCase(report: Report, decision: ReportDecision): Promise<Report> {
  if (decision === 'approve' && report.status === 'APPROVED') {
    throw new Error('This report has already been approved')
  }
  if (decision === 'reject' && report.status === 'REJECTED') {
    throw new Error('This report has already been rejected')
  }
  return decideReport(report.id, decision)
}
