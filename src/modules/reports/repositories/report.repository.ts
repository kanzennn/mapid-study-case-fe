import { http, type Paginated } from '@/lib/http'
import type {
  Report,
  ReportDecision,
  ReportListParams,
  ReportPayload,
  ReportStats,
  ReportStatsParams,
} from '../types'

export function getReports(params: ReportListParams = {}): Promise<Paginated<Report[]>> {
  return http.getPaginated<Report[]>('/reports', { ...params })
}

export function getReportStats(params: ReportStatsParams = {}): Promise<ReportStats> {
  return http.get<ReportStats>('/reports/stats', { ...params })
}

export function getReportById(id: string): Promise<Report> {
  return http.get<Report>(`/reports/${id}`)
}

export function createReport(payload: ReportPayload): Promise<Report> {
  return http.post<Report>('/reports', payload)
}

export function updateReport(id: string, payload: Partial<ReportPayload>): Promise<Report> {
  return http.patch<Report>(`/reports/${id}`, payload)
}

export function deleteReport(id: string): Promise<void> {
  return http.delete(`/reports/${id}`)
}

export function decideReport(id: string, decision: ReportDecision): Promise<Report> {
  return http.patch<Report>(`/reports/${id}/${decision}`)
}
