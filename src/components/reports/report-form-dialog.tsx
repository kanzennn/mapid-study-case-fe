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
import { Textarea } from '@/components/ui/textarea'
import { getErrorMessage } from '@/lib/http'
import type { Report } from '@/modules/reports/types'
import { createReportUseCase } from '@/modules/reports/usecases/create-report.usecase'
import { updateReportUseCase } from '@/modules/reports/usecases/update-report.usecase'

interface ReportFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** When provided, the form is in edit mode. */
  report?: Report | null
  onSaved: () => void
}

export function ReportFormDialog({ open, onOpenChange, report, onSaved }: ReportFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {/* Remount the form on every open so its initial state follows the selected report. */}
        {open && (
          <ReportForm
            key={report?.id ?? 'new'}
            report={report}
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

function ReportForm({
  report,
  onCancel,
  onSaved,
}: {
  report?: Report | null
  onCancel: () => void
  onSaved: () => void
}) {
  const isEdit = Boolean(report)
  const [title, setTitle] = useState(report?.title ?? '')
  const [description, setDescription] = useState(report?.description ?? '')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      if (report) {
        await updateReportUseCase(report, { title, description })
        toast.success('Report updated')
      } else {
        await createReportUseCase({ title, description })
        toast.success('Report submitted')
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
        <DialogTitle>{isEdit ? 'Edit report' : 'New report'}</DialogTitle>
        <DialogDescription>
          {isEdit
            ? 'A report can only be edited while it is still pending.'
            : 'New reports stay pending until an approver reviews them.'}
        </DialogDescription>
      </DialogHeader>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="report-title">Title</FieldLabel>
          <Input
            id="report-title"
            placeholder="e.g. Pothole on Main Street"
            required
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="report-description">Description</FieldLabel>
          <Textarea
            id="report-description"
            placeholder="Describe the report in detail..."
            required
            className="min-h-32"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <FieldDescription>Include the location, time of the incident, and any other supporting details.</FieldDescription>
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
          {isSubmitting ? 'Saving...' : isEdit ? 'Save changes' : 'Submit report'}
        </Button>
      </DialogFooter>
    </form>
  )
}
