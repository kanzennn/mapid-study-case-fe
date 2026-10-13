import { deleteUser } from '../repositories/user.repository'
import type { User } from '../types'

export function deleteUserUseCase(user: User): Promise<void> {
  return deleteUser(user.id)
}
