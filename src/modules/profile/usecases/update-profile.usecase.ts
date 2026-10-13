import type { User } from '@/modules/auth/types'
import { updateProfile } from '../repositories/profile.repository'
import type { UpdateProfilePayload } from '../types'
import { validateProfilePayload } from '../validations/profile.validation'

export function updateProfileUseCase(payload: UpdateProfilePayload): Promise<User> {
  return updateProfile(validateProfilePayload(payload))
}
