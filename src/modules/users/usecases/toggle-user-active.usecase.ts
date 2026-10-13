import { setUserActive } from '../repositories/user.repository'
import type { User } from '../types'

export function toggleUserActiveUseCase(user: User): Promise<User> {
  return setUserActive(user.id, !user.is_active)
}
