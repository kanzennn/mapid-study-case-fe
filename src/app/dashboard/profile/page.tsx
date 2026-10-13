import { PageHeader } from '@/components/shared/page-header'
import { useAuth } from '@/hooks/use-auth'
import { PasswordForm } from '@/app/dashboard/profile/_components/password-form'
import { ProfileForm } from '@/app/dashboard/profile/_components/profile-form'
import { ProfileSummaryCard } from '@/app/dashboard/profile/_components/profile-summary-card'

export default function ProfilePage() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <>
      <PageHeader title="Profile" description="Manage your account information and sign-in security." />

      <div className="grid items-start gap-6 lg:grid-cols-[320px_1fr]">
        <ProfileSummaryCard user={user} />
        <div className="grid gap-6">
          <ProfileForm user={user} />
          <PasswordForm />
        </div>
      </div>
    </>
  )
}
