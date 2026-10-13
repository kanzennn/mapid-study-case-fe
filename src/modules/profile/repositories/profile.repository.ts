import { http } from '@/lib/http'
import type { User } from '@/modules/auth/types'
import type { UpdatePasswordPayload, UpdateProfilePayload } from '../types'

export function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  return http.patch<User>('/auth/me', payload)
}

export function updatePassword(payload: UpdatePasswordPayload): Promise<null> {
  return http.patch<null>('/auth/password', payload)
}
