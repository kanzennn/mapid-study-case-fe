import { Badge } from '@/components/ui/badge'
import { ROLE_LABEL, type UserRole } from '@/modules/auth/types'

const ROLE_VARIANT: Record<UserRole, 'default' | 'secondary' | 'outline'> = {
  ADMIN: 'default',
  APPROVER: 'secondary',
  REPORTER: 'outline',
}

export function RoleBadge({ role }: { role: UserRole }) {
  return <Badge variant={ROLE_VARIANT[role]}>{ROLE_LABEL[role]}</Badge>
}
