import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { UserCircleIcon, IdentificationIcon, ShieldCheckIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { getUsersList } from '../../services/auth.service'

const UserCard = ({ user, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="card flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 hover:shadow-soft transition-all duration-300"
  >
    <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-primary-100 text-primary-600">
      <UserCircleIcon className="w-8 h-8" />
    </div>
    
    <div className="flex-1">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{user.nama}</h3>
      <div className="flex flex-wrap items-center gap-3 mt-1.5">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <IdentificationIcon className="w-4 h-4 text-slate-400" />
          <span>@{user.username}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheckIcon className="w-4 h-4 text-slate-400" />
          <span>{user.jabatan}</span>
        </div>
      </div>
    </div>

    <div className="flex-shrink-0 mt-3 sm:mt-0">
      {user.status === 'Aktif' ? (
        <span className="badge-green px-3 py-1.5 text-xs flex items-center gap-1">
          <CheckCircleIcon className="w-3.5 h-3.5" />
          Aktif
        </span>
      ) : (
        <span className="badge-red px-3 py-1.5 text-xs flex items-center gap-1">
          <XCircleIcon className="w-3.5 h-3.5" />
          Nonaktif
        </span>
      )}
    </div>
  </motion.div>
)

export default function PenggunaPage() {
  const { data: users, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: getUsersList,
    select: r => r.data || [],
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Daftar Pengguna</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pengguna yang memiliki akses ke sistem
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="card p-5 flex items-center gap-4">
              <div className="skeleton w-14 h-14 rounded-2xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-5 w-1/3" />
                <div className="skeleton h-4 w-1/2" />
              </div>
              <div className="skeleton h-6 w-20 rounded-full" />
            </div>
          ))
        ) : isError ? (
          <div className="card p-8 text-center text-slate-500">
            Gagal memuat data pengguna.
          </div>
        ) : users?.length === 0 ? (
          <div className="card p-8 text-center text-slate-500">
            Belum ada pengguna.
          </div>
        ) : (
          users.map((user, i) => (
            <UserCard key={user.id} user={user} index={i} />
          ))
        )}
      </div>
    </div>
  )
}
