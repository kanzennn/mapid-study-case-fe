import { Outlet, useLocation } from 'react-router-dom'

import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/use-auth'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { NAV_ITEMS } from '@/components/layout/nav-items'

export default function DashboardLayout() {
  const { user } = useAuth()
  const location = useLocation()

  // RequireAuth guarantees the user is present here.
  if (!user) return null

  const title = NAV_ITEMS.find((item) => item.url === location.pathname)?.title ?? 'Dashboard'

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
          <h1 className="text-sm font-medium">{title}</h1>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
