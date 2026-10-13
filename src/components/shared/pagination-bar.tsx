import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { PaginationMeta } from '@/lib/http'

const PAGE_SIZE_OPTIONS = [10, 20, 50].map((value) => ({ value, label: String(value) }))

interface PaginationBarProps {
  meta: PaginationMeta
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
  disabled?: boolean
}

export function PaginationBar({ meta, onPageChange, onLimitChange, disabled }: PaginationBarProps) {
  const from = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1
  const to = Math.min(meta.page * meta.limit, meta.total)
  const lastPage = Math.max(meta.total_pages, 1)

  return (
    <div className="flex flex-col-reverse gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-muted-foreground">
        Showing <span className="font-medium text-foreground tabular-nums">{from}</span>-
        <span className="font-medium text-foreground tabular-nums">{to}</span> of{' '}
        <span className="font-medium text-foreground tabular-nums">{meta.total}</span>
      </p>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Rows per page</span>
          <Select
            items={PAGE_SIZE_OPTIONS}
            value={meta.limit}
            onValueChange={(value) => value && onLimitChange(Number(value))}
          >
            <SelectTrigger size="sm" className="w-16" aria-label="Rows per page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <span className="mr-2 text-muted-foreground tabular-nums">
            Page {meta.page} of {lastPage}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Previous page"
            disabled={disabled || meta.page <= 1}
            onClick={() => onPageChange(meta.page - 1)}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Next page"
            disabled={disabled || meta.page >= lastPage}
            onClick={() => onPageChange(meta.page + 1)}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
