import { useEffect, useState } from 'react'
import { UserPlusIcon } from 'lucide-react'

import { ErrorState } from '@/components/shared/error-state'
import { PageHeader } from '@/components/shared/page-header'
import { PaginationBar } from '@/components/shared/pagination-bar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { UserFormDialog } from '@/components/users/user-form-dialog'
import { UsersFilters } from '@/app/dashboard/users/_components/users-filters'
import { UsersTable } from '@/components/users/users-table'
import {
  readUserListState,
  toUserListParams,
  writeUserListState,
} from '@/modules/users/filters'
import { useUsers } from '@/hooks/use-users'
import { useUrlListState } from '@/hooks/use-url-list-state'

export default function UsersPage() {
  const { user } = useAuth()
  const { state, searchInput, update, updateFilters, reset } = useUrlListState({
    read: readUserListState,
    write: writeUserListState,
  })
  const { users, meta, isLoading, isFetching, error, refresh } = useUsers(toUserListParams(state))

  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // If the current page becomes empty (e.g. after deleting its last item), step back to the last page.
  useEffect(() => {
    if (meta && meta.total > 0 && state.page > meta.total_pages) {
      update({ page: meta.total_pages })
    }
  }, [meta, state.page, update])

  if (!user) return null

  const isFiltered = Boolean(state.search) || state.role !== 'ALL' || state.status !== 'ALL'

  return (
    <>
      <PageHeader
        title="Users"
        description="User accounts are created and managed by admins. There is no self sign-up."
        actions={
          <Button onClick={() => setIsCreateOpen(true)}>
            <UserPlusIcon data-icon="inline-start" />
            New account
          </Button>
        }
      />

      <UsersFilters
        values={{ ...state, search: searchInput }}
        onChange={updateFilters}
        onReset={reset}
      />

      {error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : (
        <div className="space-y-3">
          <div
            aria-busy={isFetching}
            className={cn('transition-opacity', isFetching && !isLoading && 'pointer-events-none opacity-60')}
          >
            <UsersTable
              currentUser={user}
              users={users}
              isLoading={isLoading}
              onChanged={refresh}
              emptyMessage={isFiltered ? 'No users match the current filters.' : undefined}
            />
          </div>
          {meta && (
            <PaginationBar
              meta={meta}
              disabled={isFetching}
              onPageChange={(page) => update({ page })}
              onLimitChange={(limit) => update({ limit })}
            />
          )}
        </div>
      )}

      <UserFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        currentUserId={user.id}
        onSaved={refresh}
      />
    </>
  )
}
