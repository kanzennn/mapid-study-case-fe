import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="border-2 rounded-lg shadow-md p-6">
        <div className="flex flex-col p-6 md:p-10">
          <div className="flex flex-1 items-center justify-center py-10">
            <div className="w-full max-w-sm">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
