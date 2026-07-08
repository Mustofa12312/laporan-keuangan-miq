import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HomeIcon, ListBulletIcon, PlusIcon, DocumentChartBarIcon,
  Cog6ToothIcon, ClockIcon, UserGroupIcon, BanknotesIcon,
} from '@heroicons/react/24/outline'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/',            label: 'Dashboard',   icon: HomeIcon },
  { to: '/transaksi',   label: 'Transaksi',   icon: ListBulletIcon },
  { to: '/rekapitulasi',label: 'Rekapitulasi',icon: BanknotesIcon },
  { to: '/laporan',     label: 'Laporan',     icon: DocumentChartBarIcon },
  { to: '/riwayat',     label: 'Riwayat',     icon: ClockIcon },
  { to: '/pengguna',    label: 'Pengguna',    icon: UserGroupIcon },
  { to: '/pengaturan',  label: 'Pengaturan',  icon: Cog6ToothIcon },
]

export const Sidebar = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen
                       bg-white dark:bg-slate-900
                       border-r border-slate-200 dark:border-slate-700
                       fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 dark:border-slate-800">
        <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center shadow-glow">
          <BanknotesIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="font-bold text-slate-900 dark:text-white text-sm leading-tight">SIMKEU MIQ</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Keuangan MIQ se-Madura</p>
        </div>
      </div>

      {/* User info */}
      <div className="mx-4 mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-2xl">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{user?.nama}</p>
        <p className="text-xs text-primary-600 dark:text-primary-400">{user?.jabatan}</p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              }`
            }>
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* FAB Tambah */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/transaksi/tambah')}
          id="sidebar-btn-tambah"
          className="w-full btn-primary flex items-center justify-center gap-2">
          <PlusIcon className="w-4 h-4" />
          Tambah Transaksi
        </motion.button>
      </div>
    </aside>
  )
}
