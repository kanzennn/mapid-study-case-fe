import { Navigate, Route, Routes } from 'react-router-dom'

import AuthLayout from '@/app/auth/layout'
import LoginPage from '@/app/auth/login/page'
import { GuestOnly, RequireAuth, RequireRole } from './route-guards'
import DashboardLayout from '@/app/dashboard/layout'
import DashboardPage from '@/app/dashboard/page'
import ProfilePage from '@/app/dashboard/profile/page'
import ReportsPage from '@/app/dashboard/reports/page'
import UsersPage from '@/app/dashboard/users/page'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<GuestOnly />}>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
        </Route>
      </Route>

      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route element={<RequireRole roles={['REPORTER', 'APPROVER']} />}>
            <Route path="reports" element={<ReportsPage />} />
          </Route>
          <Route element={<RequireRole roles={['ADMIN']} />}>
            <Route path="users" element={<UsersPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
