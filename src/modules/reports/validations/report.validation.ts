import type { ReportPayload } from '../types'

export function validateReportPayload(payload: ReportPayload): ReportPayload {
  const title = payload.title.trim()
  const description = payload.description.trim()

  if (!title) throw new Error('Report title is required')
  if (!description) throw new Error('Report description is required')

  return { title, description }
}
