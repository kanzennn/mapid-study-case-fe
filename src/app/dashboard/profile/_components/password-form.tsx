import { useState, type ChangeEvent, type FormEvent } from 'react'
import { toast } from 'sonner'

import { PasswordInput } from '@/components/shared/password-input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { getErrorMessage } from '@/lib/http'
import type { UpdatePasswordPayload } from '@/modules/profile/types'
import { updatePasswordUseCase } from '@/modules/profile/usecases/update-password.usecase'
import { MIN_PASSWORD_LENGTH } from '@/modules/profile/validations/profile.validation'

const EMPTY: UpdatePasswordPayload = { currentPassword: '', newPassword: '', passwordConfirmation: '' }

export function PasswordForm() {
  const [values, setValues] = useState<UpdatePasswordPayload>(EMPTY)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setField = (field: keyof UpdatePasswordPayload) => (e: ChangeEvent<HTMLInputElement>) =>
    setValues((prev) => ({ ...prev, [field]: e.target.value }))

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await updatePasswordUseCase(values)
      setValues(EMPTY)
      toast.success('Password changed')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFilled = Object.values(values).every(Boolean)

  return (
    <Card>
      <form onSubmit={handleSubmit} className="contents">
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>Use a strong password you haven't used before.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="current-password">Current password</FieldLabel>
              <PasswordInput
                id="current-password"
                autoComplete="current-password"
                required
                value={values.currentPassword}
                onChange={setField('currentPassword')}
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="new-password">New password</FieldLabel>
                <PasswordInput
                  id="new-password"
                  autoComplete="new-password"
                  required
                  minLength={MIN_PASSWORD_LENGTH}
                  value={values.newPassword}
                  onChange={setField('newPassword')}
                />
                <FieldDescription>At least {MIN_PASSWORD_LENGTH} characters.</FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="password-confirmation">Confirm new password</FieldLabel>
                <PasswordInput
                  id="password-confirmation"
                  autoComplete="new-password"
                  required
                  value={values.passwordConfirmation}
                  onChange={setField('passwordConfirmation')}
                />
              </Field>
            </div>
            {error && (
              <Field data-invalid="true">
                <FieldError>{error}</FieldError>
              </Field>
            )}
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" disabled={!isFilled || isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Change password'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
