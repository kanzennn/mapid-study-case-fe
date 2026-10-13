import { CalendarIcon, MailIcon, ShieldIcon } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatDate, getInitials } from '@/lib/format'
import { ROLE_LABEL, type User } from '@/modules/auth/types'

const ROLE_DESCRIPTION: Record<User['role'], string> = {
  ADMIN: 'Administrator',
  APPROVER: 'Approver',
  REPORTER: 'Reporter',
}

export function ProfileSummaryCard({ user }: { user: User }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 text-center">
        <Avatar className="size-20">
          <AvatarFallback className="text-2xl font-medium">{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="text-lg font-semibold">{user.name}</p>
          <div className="flex items-center justify-center gap-1.5">
            <Badge variant="secondary">{ROLE_LABEL[user.role]}</Badge>
            {user.is_active && (
              <Badge
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              >
                Active
              </Badge>
            )}
          </div>
        </div>

        <Separator />

        <dl className="grid w-full gap-3 text-left text-sm">
          <div className="flex items-start gap-3">
            <MailIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <dt className="text-xs text-muted-foreground">Email</dt>
              <dd className="truncate">{user.email}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <dt className="text-xs text-muted-foreground">Access level</dt>
              <dd>{ROLE_DESCRIPTION[user.role]}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CalendarIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <dt className="text-xs text-muted-foreground">Member since</dt>
              <dd>{formatDate(user.created_at)}</dd>
            </div>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
