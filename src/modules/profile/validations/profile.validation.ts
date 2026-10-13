import type { UpdatePasswordPayload, UpdateProfilePayload } from '../types'

export const MIN_PASSWORD_LENGTH = 8

export function validateProfilePayload(payload: UpdateProfilePayload): UpdateProfilePayload {
  const name = payload.name.trim()
  if (!name) throw new Error('Name is required')
  return { name }
}

export function validatePasswordPayload(payload: UpdatePasswordPayload): UpdatePasswordPayload {
  if (!payload.currentPassword) throw new Error('Current password is required')
  if (payload.newPassword.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`New password must be at least ${MIN_PASSWORD_LENGTH} characters`)
  }
  if (payload.newPassword === payload.currentPassword) {
    throw new Error('New password must be different from the current one')
  }
  if (payload.newPassword !== payload.passwordConfirmation) {
    throw new Error('Password confirmation does not match')
  }
  return payload
}
