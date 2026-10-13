import { login } from '../repositories/auth.repository'
import { sessionRepository } from '../repositories/session.repository'
import type { LoginPayload, LoginResult } from '../types'

export async function loginUseCase(payload: LoginPayload): Promise<LoginResult> {
  if (!payload.email || !payload.password) {
    throw new Error('Email and password are required')
  }

  const result = await login(payload)
  sessionRepository.saveToken(result.token)
  return result
}
