import type { UserListParams, UserRole, UserSort } from './types'

export type RoleFilter = UserRole | 'ALL'
export type StatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE'

export interface UserFilterValues {
  search: string
  role: RoleFilter
  status: StatusFilter
  sort: UserSort
}

export interface UserListState extends UserFilterValues {
  page: number
  limit: number
}

export const DEFAULT_USER_FILTERS: UserFilterValues = {
  search: '',
  role: 'ALL',
  status: 'ALL',
  sort: '-created_at',
}

export const DEFAULT_PAGE_SIZE = 10

const ROLES: UserRole[] = ['ADMIN', 'APPROVER', 'REPORTER']
const STATUSES: StatusFilter[] = ['ALL', 'ACTIVE', 'INACTIVE']
const SORTS: UserSort[] = ['-created_at', 'created_at', 'name', '-name', 'role']

const positiveInt = (value: string | null, fallback: number) => {
  const n = Number(value)
  return Number.isInteger(n) && n > 0 ? n : fallback
}

/** Read the filter state from the URL (`?q=&role=&status=&sort=&page=&limit=`), ignoring unknown values. */
export function readUserListState(params: URLSearchParams): UserListState {
  const role = params.get('role') as UserRole | null
  const status = params.get('status') as StatusFilter | null
  const sort = params.get('sort') as UserSort | null

  return {
    search: params.get('q') ?? DEFAULT_USER_FILTERS.search,
    role: role && ROLES.includes(role) ? role : DEFAULT_USER_FILTERS.role,
    status: status && STATUSES.includes(status) ? status : DEFAULT_USER_FILTERS.status,
    sort: sort && SORTS.includes(sort) ? sort : DEFAULT_USER_FILTERS.sort,
    page: positiveInt(params.get('page'), 1),
    limit: positiveInt(params.get('limit'), DEFAULT_PAGE_SIZE),
  }
}

/** Write the state to the URL; default values are omitted to keep the URL short. */
export function writeUserListState(state: UserListState): URLSearchParams {
  const params = new URLSearchParams()
  if (state.search) params.set('q', state.search)
  if (state.role !== DEFAULT_USER_FILTERS.role) params.set('role', state.role)
  if (state.status !== DEFAULT_USER_FILTERS.status) params.set('status', state.status)
  if (state.sort !== DEFAULT_USER_FILTERS.sort) params.set('sort', state.sort)
  if (state.page !== 1) params.set('page', String(state.page))
  if (state.limit !== DEFAULT_PAGE_SIZE) params.set('limit', String(state.limit))
  return params
}

/** Convert the UI state into `GET /users` query params. */
export function toUserListParams(state: UserListState): UserListParams {
  return {
    search: state.search || undefined,
    role: state.role === 'ALL' ? undefined : [state.role],
    is_active: state.status === 'ALL' ? undefined : state.status === 'ACTIVE',
    sort: [state.sort],
    page: state.page,
    limit: state.limit,
  }
}
