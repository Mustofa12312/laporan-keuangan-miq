import { motion } from 'framer-motion'
import {
  SunIcon, MoonIcon, ComputerDesktopIcon,
  BellAlertIcon, ArrowRightOnRectangleIcon, BanknotesIcon,
} from '@heroicons/react/24/outline'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { STORAGE_KEYS } from '../../constants'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const SettingRow = ({ icon: Icon, label, desc, children }) => (
  <div className="flex items-center gap-4 py-4 border-b border-slate-100 dark:border-slate-700 last:border-0">
    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</p>
      {desc && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{desc}</p>}
    </div>
    {children}
  </div>
)

const ThemeButton = ({ icon: Icon, label, value, active, onClick }) => (
  <button onClick={() => onClick(value)}
    className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border transition-all text-xs font-medium
                ${active ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                         : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300'}`}>
    <Icon className="w-5 h-5" />
    {label}
  </button>
)

export default function PengaturanPage() {
  const { theme, changeTheme } = useTheme()
  const { user, logout }       = useAuth()
  const navigate               = useNavigate()
  const [remindNota, setRemindNota] = useState(
    localStorage.getItem(STORAGE_KEYS.REMIND_NOTA) !== 'false'
  )

  const handleToggleRemind = () => {
    const next = !remindNota
    setRemindNota(next)
    localStorage.setItem(STORAGE_KEYS.REMIND_NOTA, String(next))
    toast.success(next ? 'Pengingat nota diaktifkan' : 'Pengingat nota dinonaktifkan')
  }

  const handleLogout = () => {
    logout()
    toast.success('Berhasil logout')
    navigate('/login')
  }

  return (
    <div className="space-y-5 animate-fade-in max-w-lg mx-auto">
      <h1 className="page-title">Pengaturan</h1>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
            <BanknotesIcon className="w-7 h-7" />
          </div>
          <div>
            <p className="font-bold text-lg">{user?.nama}</p>
            <p className="text-primary-100 text-sm">{user?.jabatan}</p>
            <p className="text-primary-200 text-xs">@{user?.username}</p>
          </div>
        </div>
      </motion.div>

      {/* Settings */}
      <div className="card">
        {/* Theme */}
        <SettingRow icon={SunIcon} label="Tema Tampilan" desc="Pilih tampilan yang nyaman">
          <div className="flex gap-2">
            <ThemeButton icon={SunIcon}            label="Terang" value="light"  active={theme === 'light'}  onClick={changeTheme} />
            <ThemeButton icon={MoonIcon}           label="Gelap"  value="dark"   active={theme === 'dark'}   onClick={changeTheme} />
            <ThemeButton icon={ComputerDesktopIcon}label="Auto"   value="system" active={theme === 'system'} onClick={changeTheme} />
          </div>
        </SettingRow>

        {/* Remind nota */}
        <SettingRow icon={BellAlertIcon}
          label="Pengingat Nota"
          desc="Ingatkan untuk menyimpan nota fisik">
          <button onClick={handleToggleRemind} id="toggle-remind-nota"
            className={`relative w-11 h-6 rounded-full transition-colors duration-200
                        ${remindNota ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow
                             transition-transform duration-200
                             ${remindNota ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </SettingRow>
      </div>

      {/* Info */}
      <div className="card text-center space-y-1">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">SIMKEU MIQ</p>
        <p className="text-xs text-slate-400">Sistem Informasi Manajemen Keuangan</p>
        <p className="text-xs text-slate-400">Kursus MIQ se-Madura</p>
        <p className="text-xs text-slate-300 dark:text-slate-600 mt-2">v1.0.0 · Juli 2026</p>
      </div>

      {/* Logout */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleLogout}
        id="btn-logout"
        className="w-full btn-danger flex items-center justify-center gap-2 py-3.5">
        <ArrowRightOnRectangleIcon className="w-5 h-5" />
        Keluar dari Akun
      </motion.button>
    </div>
  )
}
