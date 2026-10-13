import { http } from '@/lib/http'
import type { LoginPayload, LoginResult, User } from '../types'

export function login(payload: LoginPayload): Promise<LoginResult> {
  return http.post<LoginResult>('/auth/login', payload)
}

export function getMe(): Promise<User> {
  return http.get<User>('/auth/me')
}
