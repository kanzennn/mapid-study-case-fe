import { createUser } from '../repositories/user.repository'
import type { CreateUserPayload, User } from '../types'

export function createUserUseCase(payload: CreateUserPayload): Promise<User> {
  const name = payload.name.trim()
  const email = payload.email.trim()

  if (name.length < 2) throw new Error('Name must be at least 2 characters')
  if (!email) throw new Error('Email is required')
  if (payload.password.length < 8) throw new Error('Password must be at least 8 characters')

  return createUser({ ...payload, name, email })
}
