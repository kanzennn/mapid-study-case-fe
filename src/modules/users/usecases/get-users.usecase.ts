import type { Paginated } from '@/lib/http'
import { getUsers } from '../repositories/user.repository'
import type { User, UserListParams } from '../types'

export function getUsersUseCase(params: UserListParams = {}): Promise<Paginated<User[]>> {
  return getUsers({ ...params, search: params.search?.trim() || undefined })
}
