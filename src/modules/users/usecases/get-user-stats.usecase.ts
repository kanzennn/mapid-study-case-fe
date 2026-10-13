import { getUsers } from '../repositories/user.repository'
import type { UserListParams, UserStats } from '../types'

/** Count users per category via `meta.total` (limit=1), without fetching every record. */
async function countUsers(params: UserListParams = {}) {
  const { meta } = await getUsers({ ...params, limit: 1 })
  return meta?.total ?? 0
}

export async function getUserStatsUseCase(): Promise<UserStats> {
  const [total, active, reporters, approvers] = await Promise.all([
    countUsers(),
    countUsers({ is_active: true }),
    countUsers({ role: ['REPORTER'] }),
    countUsers({ role: ['APPROVER'] }),
  ])
  return { total, active, reporters, approvers }
}
