import { useState } from 'react'
import { CheckIcon, EyeIcon, FileTextIcon, PencilIcon, Trash2Icon, XIcon } from 'lucide-react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDateTime } from '@/lib/format'
import { getErrorMessage } from '@/lib/http'
import type { User } from '@/modules/auth/types'
import { reportPermissions } from '@/modules/reports/permissions'
import type { Report, ReportDecision } from '@/modules/reports/types'
import { decideReportUseCase } from '@/modules/reports/usecases/decide-report.usecase'
import { deleteReportUseCase } from '@/modules/reports/usecases/delete-report.usecase'
import { ReportDetailDialog } from './report-detail-dialog'
import { ReportFormDialog } from './report-form-dialog'
import { ReportStatusBadge } from './report-status-badge'

interface ReportsTableProps {
  user: User
  reports: Report[]
  isLoading?: boolean
  onChanged: () => void
  emptyMessage?: string
}

export function ReportsTable({ user, reports, isLoading, onChanged, emptyMessage }: ReportsTableProps) {
  const [detailId, setDetailId] = useState<string | null>(null)
  const [editing, setEditing] = useState<Report | null>(null)
  const [deleting, setDeleting] = useState<Report | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const showReporter = user.role !== 'REPORTER'
  const columnCount = showReporter ? 6 : 5

  async function handleDecide(report: Report, decision: ReportDecision) {
    setBusyId(report.id)
    try {
      await decideReportUseCase(report, decision)
      toast.success(decision === 'approve' ? 'Report approved' : 'Report rejected', {
        description: report.title,
      })
      onChanged()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  async function handleDelete() {
    if (!deleting) return
    setBusyId(deleting.id)
    try {
      await deleteReportUseCase(deleting)
      toast.success('Report deleted')
      setDeleting(null)
      onChanged()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="min-w-64 pl-4">Report</TableHead>
              {showReporter && <TableHead>Reporter</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead>Last decision</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="pr-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: columnCount }).map((__, j) => (
                    <TableCell key={j} className="first:pl-4 last:pr-4">
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!isLoading && reports.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columnCount} className="h-40 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <FileTextIcon className="size-8 opacity-40" />
                    <p className="text-sm">{emptyMessage ?? 'No reports yet.'}</p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              reports.map((report) => {
                const lastDecision = report.report_status_histories[0]
                const isBusy = busyId === report.id
                const canEdit = reportPermissions.canEdit(user, report)

                return (
                  <TableRow key={report.id}>
                    <TableCell className="max-w-80 pl-4 whitespace-normal">
                      <button
                        type="button"
                        className="text-left font-medium hover:underline"
                        onClick={() => setDetailId(report.id)}
                      >
                        {report.title}
                      </button>
                      <p className="line-clamp-1 text-xs text-muted-foreground">{report.description}</p>
                    </TableCell>
                    {showReporter && (
                      <TableCell>
                        <p className="font-medium">{report.reporter.name}</p>
                        <p className="text-xs text-muted-foreground">{report.reporter.email}</p>
                      </TableCell>
                    )}
                    <TableCell>
                      <ReportStatusBadge status={report.status} />
                    </TableCell>
                    <TableCell>
                      {lastDecision ? (
                        <>
                          <p>{lastDecision.approver.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDateTime(lastDecision.created_at)}
                          </p>
                        </>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDateTime(report.created_at)}</TableCell>
                    <TableCell className="pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="View details"
                          title="View details"
                          onClick={() => setDetailId(report.id)}
                        >
                          <EyeIcon />
                        </Button>

                        {reportPermissions.canDecide(user) && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-emerald-700 hover:bg-emerald-500/10 hover:text-emerald-700 dark:text-emerald-400"
                              disabled={isBusy || !reportPermissions.canApprove(user, report)}
                              onClick={() => handleDecide(report, 'approve')}
                            >
                              <CheckIcon data-icon="inline-start" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-700 hover:bg-red-500/10 hover:text-red-700 dark:text-red-400"
                              disabled={isBusy || !reportPermissions.canReject(user, report)}
                              onClick={() => handleDecide(report, 'reject')}
                            >
                              <XIcon data-icon="inline-start" />
                              Reject
                            </Button>
                          </>
                        )}

                        {user.role === 'REPORTER' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label="Edit report"
                              title={canEdit ? 'Edit report' : 'Only pending reports can be edited'}
                              disabled={!canEdit || isBusy}
                              onClick={() => setEditing(report)}
                            >
                              <PencilIcon />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label="Delete report"
                              title={canEdit ? 'Delete report' : 'Only pending reports can be deleted'}
                              className="text-destructive hover:text-destructive"
                              disabled={!canEdit || isBusy}
                              onClick={() => setDeleting(report)}
                            >
                              <Trash2Icon />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </div>

      <ReportDetailDialog reportId={detailId} onOpenChange={(open) => !open && setDetailId(null)} />

      <ReportFormDialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        report={editing}
        onSaved={onChanged}
      />

      <AlertDialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete report?</AlertDialogTitle>
            <AlertDialogDescription>
              The report <span className="font-medium text-foreground">"{deleting?.title}"</span> will be
              permanently deleted. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" disabled={busyId !== null} onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
