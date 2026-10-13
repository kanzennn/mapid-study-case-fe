import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getErrorMessage } from '@/lib/http'
import { ROLE_LABEL } from '@/modules/auth/types'
import type { User, UserRole } from '@/modules/users/types'
import { createUserUseCase } from '@/modules/users/usecases/create-user.usecase'
import { updateUserUseCase } from '@/modules/users/usecases/update-user.usecase'

const ROLE_OPTIONS = (Object.keys(ROLE_LABEL) as UserRole[]).map((value) => ({
  value,
  label: ROLE_LABEL[value],
}))

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
  /** Admins may not change their own role. */
  currentUserId: string
  onSaved: () => void
}

export function UserFormDialog({ open, onOpenChange, user, currentUserId, onSaved }: UserFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {open && (
          <UserForm
            key={user?.id ?? 'new'}
            user={user}
            isSelf={user?.id === currentUserId}
            onCancel={() => onOpenChange(false)}
            onSaved={() => {
              onOpenChange(false)
              onSaved()
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function UserForm({
  user,
  isSelf,
  onCancel,
  onSaved,
}: {
  user?: User | null
  isSelf: boolean
  onCancel: () => void
  onSaved: () => void
}) {
  const isEdit = Boolean(user)
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>(user?.role ?? 'REPORTER')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      if (user) {
        await updateUserUseCase(user, { name, email, password, role: isSelf ? undefined : role })
        toast.success('Account updated')
      } else {
        await createUserUseCase({ name, email, password, role })
        toast.success('Account created')
      }
      onSaved()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <DialogHeader>
        <DialogTitle>{isEdit ? 'Edit account' : 'New account'}</DialogTitle>
        <DialogDescription>
          {isEdit ? "Update this user's account details." : 'New accounts are active immediately and can be used to sign in.'}
        </DialogDescription>
      </DialogHeader>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="user-name">Name</FieldLabel>
          <Input id="user-name" required autoFocus value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field>
          <FieldLabel htmlFor="user-email">Email</FieldLabel>
          <Input
            id="user-email"
            type="email"
            required
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="user-password">Password</FieldLabel>
          <Input
            id="user-password"
            type="password"
            autoComplete="new-password"
            required={!isEdit}
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FieldDescription>
            {isEdit ? 'Leave blank to keep the current password.' : 'At least 8 characters.'}
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="user-role">Role</FieldLabel>
          <Select
            items={ROLE_OPTIONS}
            value={role}
            onValueChange={(value) => value && setRole(value as UserRole)}
            disabled={isSelf}
          >
            <SelectTrigger id="user-role" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isSelf && <FieldDescription>You can't change the role of your own account.</FieldDescription>}
        </Field>
        {error && (
          <Field data-invalid="true">
            <FieldError>{error}</FieldError>
          </Field>
        )}
      </FieldGroup>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEdit ? 'Save changes' : 'Create account'}
        </Button>
      </DialogFooter>
    </form>
  )
}
