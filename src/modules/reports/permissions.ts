import type { User } from '@/modules/auth/types'
import type { Report } from './types'

export const reportPermissions = {
  canView: (user: User) => user.role === 'REPORTER' || user.role === 'APPROVER',
  canCreate: (user: User) => user.role === 'REPORTER',
  /** Reporters may only edit/delete their own reports while they are still pending. */
  canEdit: (user: User, report: Report) =>
    user.role === 'REPORTER' && report.reporter_id === user.id && report.status === 'PENDING',
  canDecide: (user: User) => user.role === 'APPROVER',
  /** Approvers can reverse a decision. */
  canApprove: (user: User, report: Report) => user.role === 'APPROVER' && report.status !== 'APPROVED',
  canReject: (user: User, report: Report) => user.role === 'APPROVER' && report.status !== 'REJECTED',
}
