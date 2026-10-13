import { SearchIcon, XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  isReportFilterActive,
  REPORT_STATUS_FILTERS,
  type ReportFilterValues,
  type ReportStatusFilter,
} from '@/modules/reports/filters'
import { REPORT_STATUS_LABEL, type ReportSort, type ReportStats } from '@/modules/reports/types'

const SORT_OPTIONS: { value: ReportSort; label: string }[] = [
  { value: '-created_at', label: 'Newest' },
  { value: 'created_at', label: 'Oldest' },
  { value: '-updated_at', label: 'Recently updated' },
  { value: 'title', label: 'Title A-Z' },
  { value: '-title', label: 'Title Z-A' },
]

interface ReportsFiltersProps {
  values: ReportFilterValues
  stats: ReportStats
  searchPlaceholder: string
  onChange: (patch: Partial<ReportFilterValues>) => void
  onReset: () => void
}

export function ReportsFilters({ values, stats, searchPlaceholder, onChange, onReset }: ReportsFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs value={values.status} onValueChange={(value) => onChange({ status: value as ReportStatusFilter })}>
          <TabsList>
            {REPORT_STATUS_FILTERS.map((status) => (
              <TabsTrigger key={status} value={status}>
                {status === 'ALL' ? 'All' : REPORT_STATUS_LABEL[status]}
                <span className="ml-1 rounded-full bg-muted px-1.5 text-xs text-muted-foreground tabular-nums">
                  {status === 'ALL' ? stats.total : stats[status]}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="relative lg:w-80">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            aria-label="Search reports"
            className="pl-8"
            value={values.search}
            onChange={(e) => onChange({ search: e.target.value })}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <label htmlFor="reports-from" className="text-sm text-muted-foreground">
            From
          </label>
          <Input
            id="reports-from"
            type="date"
            className="w-40"
            max={values.to || undefined}
            value={values.from}
            onChange={(e) => onChange({ from: e.target.value })}
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="reports-to" className="text-sm text-muted-foreground">
            To
          </label>
          <Input
            id="reports-to"
            type="date"
            className="w-40"
            min={values.from || undefined}
            value={values.to}
            onChange={(e) => onChange({ to: e.target.value })}
          />
        </div>

        <Select
          items={SORT_OPTIONS}
          value={values.sort}
          onValueChange={(value) => value && onChange({ sort: value as ReportSort })}
        >
          <SelectTrigger className="w-44" aria-label="Sort by">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isReportFilterActive(values) && (
          <Button variant="ghost" onClick={onReset}>
            <XIcon data-icon="inline-start" />
            Reset
          </Button>
        )}
      </div>
    </div>
  )
}
