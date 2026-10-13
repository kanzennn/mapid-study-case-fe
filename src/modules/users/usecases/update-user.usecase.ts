import { updateUser } from '../repositories/user.repository'
import type { UpdateUserPayload, User } from '../types'

export function updateUserUseCase(user: User, payload: UpdateUserPayload): Promise<User> {
  const data: UpdateUserPayload = {}
  const name = payload.name?.trim()
  const email = payload.email?.trim()

  if (name !== undefined) {
    if (name.length < 2) throw new Error('Name must be at least 2 characters')
    if (name !== user.name) data.name = name
  }
  if (email && email !== user.email) data.email = email
  if (payload.role && payload.role !== user.role) data.role = payload.role
  // An empty password means it is left unchanged.
  if (payload.password) {
    if (payload.password.length < 8) throw new Error('Password must be at least 8 characters')
    data.password = payload.password
  }

  return updateUser(user.id, data)
}
