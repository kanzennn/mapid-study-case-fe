export interface UpdateProfilePayload {
  name: string
}

export interface UpdatePasswordPayload {
  currentPassword: string
  newPassword: string
  passwordConfirmation: string
}
