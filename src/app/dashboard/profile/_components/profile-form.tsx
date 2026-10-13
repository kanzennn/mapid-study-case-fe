import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { getErrorMessage } from '@/lib/http'
import { useAuth } from '@/hooks/use-auth'
import { ROLE_LABEL, type User } from '@/modules/auth/types'
import { updateProfileUseCase } from '@/modules/profile/usecases/update-profile.usecase'

export function ProfileForm({ user }: { user: User }) {
  const { setCurrentUser } = useAuth()
  const [name, setName] = useState(user.name)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isDirty = name.trim() !== user.name

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const updated = await updateProfileUseCase({ name })
      setCurrentUser(updated)
      setName(updated.name)
      toast.success('Profile updated')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="contents">
        <CardHeader>
          <CardTitle>Account information</CardTitle>
          <CardDescription>Update the name shown across the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="profile-name">Name</FieldLabel>
              <Input id="profile-name" required value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field data-disabled="true">
                <FieldLabel htmlFor="profile-email">Email</FieldLabel>
                <Input id="profile-email" value={user.email} disabled />
              </Field>
              <Field data-disabled="true">
                <FieldLabel htmlFor="profile-role">Role</FieldLabel>
                <Input id="profile-role" value={ROLE_LABEL[user.role]} disabled />
              </Field>
            </div>
            {error && (
              <Field data-invalid="true">
                <FieldError>{error}</FieldError>
              </Field>
            )}
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button type="button" variant="outline" disabled={!isDirty || isSubmitting} onClick={() => setName(user.name)}>
            Cancel
          </Button>
          <Button type="submit" disabled={!isDirty || isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save changes'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
