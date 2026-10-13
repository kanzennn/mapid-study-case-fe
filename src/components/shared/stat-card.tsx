import type { LucideIcon } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: number
  icon: LucideIcon
  hint?: string
  tone?: 'default' | 'amber' | 'emerald' | 'red' | 'indigo'
  isLoading?: boolean
}

const TONE_STYLE: Record<NonNullable<StatCardProps['tone']>, string> = {
  default: 'bg-muted text-foreground',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  red: 'bg-red-500/10 text-red-600 dark:text-red-400',
  indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
}

export function StatCard({ label, value, icon: Icon, hint, tone = 'default', isLoading }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          {isLoading ? (
            <Skeleton className="h-8 w-12" />
          ) : (
            <p className="text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
          )}
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className={cn('flex size-10 items-center justify-center rounded-lg', TONE_STYLE[tone])}>
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  )
}
