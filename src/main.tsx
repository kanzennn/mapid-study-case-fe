import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppRouter } from '@/app/router'
import { AuthProvider } from '@/providers/auth-provider'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <TooltipProvider>
        <AppRouter />
        <Toaster richColors position="top-right" />
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>,
)
