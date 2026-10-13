import { CircleCheckIcon, CircleXIcon, ClockIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { REPORT_STATUS_LABEL, type ReportStatus } from '@/modules/reports/types'

const STATUS_STYLE: Record<ReportStatus, string> = {
  PENDING: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
  APPROVED: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  REJECTED: 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400',
}

const STATUS_ICON: Record<ReportStatus, typeof ClockIcon> = {
  PENDING: ClockIcon,
  APPROVED: CircleCheckIcon,
  REJECTED: CircleXIcon,
}

export function ReportStatusBadge({ status, className }: { status: ReportStatus; className?: string }) {
  const Icon = STATUS_ICON[status]
  return (
    <Badge variant="outline" className={cn(STATUS_STYLE[status], className)}>
      <Icon data-icon="inline-start" />
      {REPORT_STATUS_LABEL[status]}
    </Badge>
  )
}
