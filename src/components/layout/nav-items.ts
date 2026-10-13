import { FileTextIcon, LayoutDashboardIcon, UserRoundIcon, UsersIcon, type LucideIcon } from 'lucide-react'

import type { UserRole } from '@/modules/auth/types'

export interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  roles: UserRole[]
}

export const NAV_ITEMS: NavItem[] = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboardIcon, roles: ['ADMIN', 'APPROVER', 'REPORTER'] },
  { title: 'Reports', url: '/dashboard/reports', icon: FileTextIcon, roles: ['APPROVER', 'REPORTER'] },
  { title: 'Users', url: '/dashboard/users', icon: UsersIcon, roles: ['ADMIN'] },
  { title: 'Profile', url: '/dashboard/profile', icon: UserRoundIcon, roles: ['ADMIN', 'APPROVER', 'REPORTER'] },
]
