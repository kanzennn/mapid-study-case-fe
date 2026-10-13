import { getMe } from '../repositories/auth.repository'
import { sessionRepository } from '../repositories/session.repository'
import type { User } from '../types'

export async function getCurrentUserUseCase(): Promise<User | null> {
  if (!sessionRepository.hasToken()) return null
  return getMe()
}
