import { SearchIcon, XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ROLE_LABEL } from '@/modules/auth/types'
import { DEFAULT_USER_FILTERS, type RoleFilter, type StatusFilter, type UserFilterValues } from '@/modules/users/filters'
import type { UserRole, UserSort } from '@/modules/users/types'

const ROLE_OPTIONS: { value: RoleFilter; label: string }[] = [
  { value: 'ALL', label: 'All roles' },
  ...(Object.keys(ROLE_LABEL) as UserRole[]).map((value) => ({ value, label: ROLE_LABEL[value] })),
]

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'All status' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
]

const SORT_OPTIONS: { value: UserSort; label: string }[] = [
  { value: '-created_at', label: 'Newest' },
  { value: 'created_at', label: 'Oldest' },
  { value: 'name', label: 'Name A-Z' },
  { value: '-name', label: 'Name Z-A' },
  { value: 'role', label: 'Role' },
]

interface UsersFiltersProps {
  values: UserFilterValues
  onChange: (patch: Partial<UserFilterValues>) => void
  onReset: () => void
}

export function UsersFilters({ values, onChange, onReset }: UsersFiltersProps) {
  const isFiltered =
    values.search !== DEFAULT_USER_FILTERS.search ||
    values.role !== DEFAULT_USER_FILTERS.role ||
    values.status !== DEFAULT_USER_FILTERS.status

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center">
      <div className="relative md:w-72">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search name or email..."
          aria-label="Search users"
          className="pl-8"
          value={values.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          items={ROLE_OPTIONS}
          value={values.role}
          onValueChange={(value) => value && onChange({ role: value as RoleFilter })}
        >
          <SelectTrigger className="w-36" aria-label="Filter role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          items={STATUS_OPTIONS}
          value={values.status}
          onValueChange={(value) => value && onChange({ status: value as StatusFilter })}
        >
          <SelectTrigger className="w-36" aria-label="Filter status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          items={SORT_OPTIONS}
          value={values.sort}
          onValueChange={(value) => value && onChange({ sort: value as UserSort })}
        >
          <SelectTrigger className="w-36" aria-label="Sort by">
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

        {isFiltered && (
          <Button variant="ghost" onClick={onReset}>
            <XIcon data-icon="inline-start" />
            Reset
          </Button>
        )}
      </div>
    </div>
  )
}
