import { updatePassword } from '../repositories/profile.repository'
import type { UpdatePasswordPayload } from '../types'
import { validatePasswordPayload } from '../validations/profile.validation'

export async function updatePasswordUseCase(payload: UpdatePasswordPayload): Promise<void> {
  await updatePassword(validatePasswordPayload(payload))
}
