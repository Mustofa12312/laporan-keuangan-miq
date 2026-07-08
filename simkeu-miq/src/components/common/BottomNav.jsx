import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HomeIcon, ListBulletIcon, PlusCircleIcon,
  DocumentChartBarIcon, Cog6ToothIcon,
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeIconSolid, ListBulletIcon as ListIconSolid,
  DocumentChartBarIcon as ChartIconSolid, Cog6ToothIcon as CogIconSolid,
} from '@heroicons/react/24/solid'

const navItems = [
  { to: '/',           label: 'Dashboard', Icon: HomeIcon,            ActiveIcon: HomeIconSolid },
  { to: '/transaksi',  label: 'Transaksi', Icon: ListBulletIcon,      ActiveIcon: ListIconSolid },
  { to: '/laporan',    label: 'Laporan',   Icon: DocumentChartBarIcon, ActiveIcon: ChartIconSolid },
  { to: '/pengaturan', label: 'Pengaturan',Icon: Cog6ToothIcon,        ActiveIcon: CogIconSolid },
]

export const BottomNav = () => {
  const navigate = useNavigate()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50
                    bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg
                    border-t border-slate-200 dark:border-slate-700
                    flex items-center justify-around px-2
                    pb-[env(safe-area-inset-bottom)]"
         style={{ height: '64px' }}>

      {navItems.slice(0, 2).map(({ to, label, Icon, ActiveIcon }) => (
        <NavLink key={to} to={to} end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl transition-all duration-200 ${
              isActive ? 'text-primary-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`
          }>
          {({ isActive }) => (
            <>
              {isActive ? <ActiveIcon className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
              <span className="text-[10px] font-medium">{label}</span>
            </>
          )}
        </NavLink>
      ))}

      {/* FAB Tambah */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate('/transaksi/tambah')}
        id="btn-fab-tambah"
        className="flex flex-col items-center gap-0.5 -mt-6">
        <div className="w-14 h-14 bg-primary-600 rounded-full flex items-center justify-center
                        shadow-glow shadow-lg hover:bg-primary-700 transition-colors">
          <PlusCircleIcon className="w-7 h-7 text-white" />
        </div>
        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">Tambah</span>
      </motion.button>

      {navItems.slice(2).map(({ to, label, Icon, ActiveIcon }) => (
        <NavLink key={to} to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl transition-all duration-200 ${
              isActive ? 'text-primary-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`
          }>
          {({ isActive }) => (
            <>
              {isActive ? <ActiveIcon className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
              <span className="text-[10px] font-medium">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
