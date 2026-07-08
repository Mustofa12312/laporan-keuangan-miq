import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ClockIcon, PencilSquareIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline'
import { getLogs } from '../../services/transaction.service'
import { formatDateTime } from '../../utils/format'

const actionMeta = {
  Tambah: { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', icon: PlusCircleIcon },
  Edit:   { color: 'text-blue-600 dark:text-blue-400',  bg: 'bg-blue-100 dark:bg-blue-900/30',   icon: PencilSquareIcon },
  Hapus:  { color: 'text-red-500 dark:text-red-400',    bg: 'bg-red-100 dark:bg-red-900/30',     icon: TrashIcon },
}

export default function RiwayatPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['logs'],
    queryFn: () => getLogs({ limit: 50 }),
  })

  const logs = data?.data || []

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="page-title">Riwayat Aktivitas</h1>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <div key={i} className="card"><div className="skeleton h-14 w-full" /></div>)}
        </div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <ClockIcon className="w-12 h-12 text-slate-300 dark:text-slate-600" />
          <p className="text-slate-500 dark:text-slate-400">Belum ada aktivitas tercatat</p>
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log, i) => {
            const meta = actionMeta[log.aksi] || actionMeta.Tambah
            const Icon = meta.icon
            return (
              <motion.div key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="card flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.bg}`}>
                  <Icon className={`w-4 h-4 ${meta.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold ${meta.color}`}>{log.aksi}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">oleh {log.user}</span>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    {formatDateTime(log.waktu)}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
