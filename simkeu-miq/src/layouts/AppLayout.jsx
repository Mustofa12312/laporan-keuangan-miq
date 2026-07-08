import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/common/Sidebar'
import { BottomNav } from '../components/common/BottomNav'

export const AppLayout = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
    <Sidebar />
    <main className="lg:pl-64">
      <div className="max-w-4xl mx-auto px-4 pt-4 pb-[80px] lg:pb-8 lg:px-6 lg:pt-6">
        <Outlet />
      </div>
    </main>
    <BottomNav />
  </div>
)
