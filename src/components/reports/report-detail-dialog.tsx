import { useEffect, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDateTime } from '@/lib/format'
import { getErrorMessage } from '@/lib/http'
import { cn } from '@/lib/utils'
import type { Report, ReportStatus } from '@/modules/reports/types'
import { REPORT_STATUS_LABEL } from '@/modules/reports/types'
import { getReportDetailUseCase } from '@/modules/reports/usecases/get-report-detail.usecase'
import { ReportStatusBadge } from './report-status-badge'

interface ReportDetailDialogProps {
  reportId: string | null
  onOpenChange: (open: boolean) => void
}

export function ReportDetailDialog({ reportId, onOpenChange }: ReportDetailDialogProps) {
  return (
    <Dialog open={reportId !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        {reportId && <ReportDetail key={reportId} reportId={reportId} />}
      </DialogContent>
    </Dialog>
  )
}

const DOT_STYLE: Record<ReportStatus, string> = {
  PENDING: 'bg-amber-500',
  APPROVED: 'bg-emerald-500',
  REJECTED: 'bg-red-500',
}

function ReportDetail({ reportId }: { reportId: string }) {
  const [report, setReport] = useState<Report | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getReportDetailUseCase(reportId)
      .then(setReport)
      .catch((err) => setError(getErrorMessage(err)))
  }, [reportId])

  if (error) {
    return (
      <DialogHeader>
        <DialogTitle>Failed to load report</DialogTitle>
        <DialogDescription>{error}</DialogDescription>
      </DialogHeader>
    )
  }

  if (!report) {
    return (
      <div className="grid gap-3">
        <DialogTitle className="sr-only">Loading report</DialogTitle>
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <DialogHeader>
        <div className="flex items-start justify-between gap-3 pr-8">
          <DialogTitle className="text-base leading-snug">{report.title}</DialogTitle>
          <ReportStatusBadge status={report.status} className="shrink-0" />
        </div>
        <DialogDescription>
          Reported by <span className="font-medium text-foreground">{report.reporter.name}</span> on{' '}
          {formatDateTime(report.created_at)}
        </DialogDescription>
      </DialogHeader>

      <p className="max-h-60 overflow-y-auto rounded-lg bg-muted/50 p-3 text-sm leading-relaxed whitespace-pre-wrap">
        {report.description}
      </p>

      <Separator />

      <section className="grid gap-3">
        <h3 className="text-sm font-medium">Approval history</h3>
        {report.report_status_histories.length === 0 ? (
          <p className="text-sm text-muted-foreground">No decision from an approver yet.</p>
        ) : (
          <ol>
            {report.report_status_histories.map((history, index, list) => (
              <li key={history.id} className="relative flex gap-3 pb-4 last:pb-0">
                {index < list.length - 1 && (
                  <span aria-hidden className="absolute top-3 bottom-0 left-[4.5px] w-px bg-border" />
                )}
                <span
                  aria-hidden
                  className={cn('relative mt-1.5 size-2.5 shrink-0 rounded-full', DOT_STYLE[history.status])}
                />
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{history.approver.name}</span>{' '}
                    {history.status === 'APPROVED' ? 'approved' : 'rejected'} the report
                    {index === 0 && <span className="ml-2 text-xs text-muted-foreground">(latest)</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {REPORT_STATUS_LABEL[history.status]} on {formatDateTime(history.created_at)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}
