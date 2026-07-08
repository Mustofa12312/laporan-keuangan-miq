import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  BanknotesIcon, ReceiptPercentIcon, DocumentTextIcon,
  ChartPieIcon, ArrowTrendingUpIcon, PlusIcon,
} from '@heroicons/react/24/outline'
import { getDashboard } from '../../services/transaction.service'
import { useAuth } from '../../context/AuthContext'
import { formatRupiah, formatRupiahShort, timeAgo } from '../../utils/format'
import { CATEGORIES, CATEGORY_MAP } from '../../constants'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'

const COLORS = ['#2563EB', '#D97706', '#7C3AED', '#0891B2', '#059669', '#DC2626']

const StatCard = ({ label, value, icon: Icon, color, bg, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="stat-card">
    <div className="flex items-start justify-between">
      <div className="stat-icon" style={{ background: bg || '#f0fdf4' }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
    </div>
    <div>
      <p className="text-xl font-bold text-slate-900 dark:text-white truncate">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
    </div>
  </motion.div>
)

const TransactionItem = ({ t, index }) => {
  const cat = CATEGORY_MAP[t.kategori]
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-3 py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
           style={{ background: cat?.bg || '#f1f5f9' }}>
        <BanknotesIcon className="w-4 h-4" style={{ color: cat?.color || '#64748b' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{t.uraian}</p>
        <p className="text-xs text-slate-400">{timeAgo(t.dibuatPada)}</p>
      </div>
      <p className="text-sm font-bold text-slate-900 dark:text-white flex-shrink-0">
        {formatRupiahShort(t.jumlah)}
      </p>
    </motion.div>
  )
}

const SkeletonCard = () => (
  <div className="card space-y-2">
    <div className="skeleton h-10 w-10 rounded-xl" />
    <div className="skeleton h-6 w-24" />
    <div className="skeleton h-4 w-32" />
  </div>
)

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                    rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-slate-800 dark:text-slate-200">{payload[0].name}</p>
      <p className="text-primary-600 font-bold">{formatRupiah(payload[0].value)}</p>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboard,
    staleTime: 5 * 60 * 1000,
    select: (res) => res.data,
  })

  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  // Prepare chart data
  const pieData = CATEGORIES.map((cat, i) => ({
    name: cat.label,
    value: data?.rekap?.[cat.id] || 0,
    color: COLORS[i],
  })).filter(d => d.value > 0)

  const barData = CATEGORIES.map(cat => ({
    name: cat.label.split(' ')[0],
    jumlah: data?.rekap?.[cat.id] || 0,
  }))

  if (isError) return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
      <p className="text-slate-500 dark:text-slate-400">Gagal memuat dashboard</p>
      <button onClick={() => refetch()} className="btn-primary text-sm px-4 py-2">Coba Lagi</button>
    </div>
  )

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-400 dark:text-slate-500">{today}</p>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            Halo, {user?.nama?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{user?.jabatan}</p>
        </div>
        <Link to="/transaksi/tambah"
          id="dashboard-btn-tambah"
          className="btn-primary text-xs px-3 py-2 gap-1">
          <PlusIcon className="w-4 h-4" />
          Tambah
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3">
        {isLoading ? (
          [1,2,3,4].map(i => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard label="Total Pengeluaran"  value={formatRupiahShort(data?.totalPengeluaran)} icon={BanknotesIcon}      color="#16a34a" bg="#f0fdf4" delay={0.0} />
            <StatCard label="Jumlah Transaksi"   value={data?.jumlahTransaksi || 0}                icon={ArrowTrendingUpIcon} color="#2563eb" bg="#eff6ff" delay={0.05} />
            <StatCard label="Jumlah Nota"         value={data?.jumlahNota || 0}                     icon={ReceiptPercentIcon}  color="#7c3aed" bg="#f5f3ff" delay={0.1} />
            <StatCard label="Kategori Terbesar"  value={CATEGORY_MAP[data?.kategoriTerbesar]?.label || '-'} icon={ChartPieIcon} color="#d97706" bg="#fffbeb" delay={0.15} />
          </>
        )}
      </div>

      {/* Total card highlight */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-primary-700 p-5 text-white shadow-glow">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full" />
          <div className="absolute -right-2 -bottom-8 w-32 h-32 bg-white/5 rounded-full" />
          <p className="text-sm text-primary-100">Grand Total Pengeluaran</p>
          <p className="text-3xl font-bold mt-1">{formatRupiah(data?.totalPengeluaran || 0)}</p>
          <p className="text-xs text-primary-200 mt-2">{data?.jumlahTransaksi || 0} transaksi tercatat</p>
          <Link to="/rekapitulasi" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold
                                             bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl transition-colors">
            <DocumentTextIcon className="w-3.5 h-3.5" />
            Lihat Rekap
          </Link>
        </motion.div>
      )}

      {/* Charts */}
      {!isLoading && pieData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="card">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <ChartPieIcon className="w-4 h-4 text-primary-600" />
            Distribusi Pengeluaran
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                   paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => <span className="text-xs text-slate-600 dark:text-slate-400">{value}</span>}
                iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Bar Chart */}
      {!isLoading && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="card">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">
            Per Kategori
          </h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickFormatter={v => `${v/1e6}jt`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="jumlah" name="Pengeluaran" fill="#16a34a" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Recent Transactions */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Aktivitas Terbaru</h2>
          <Link to="/transaksi" className="text-xs text-primary-600 hover:underline font-medium">Lihat Semua</Link>
        </div>
        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="flex gap-3 items-center">
                <div className="skeleton w-9 h-9 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="skeleton h-3.5 w-3/4" />
                  <div className="skeleton h-3 w-1/2" />
                </div>
                <div className="skeleton h-4 w-16" />
              </div>
            ))}
          </div>
        ) : data?.transaksiTerbaru?.length ? (
          data.transaksiTerbaru.map((t, i) => <TransactionItem key={t.id} t={t} index={i} />)
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-400 text-sm">Belum ada transaksi</p>
            <Link to="/transaksi/tambah" id="dashboard-empty-tambah"
              className="mt-3 inline-flex btn-primary text-xs px-4 py-2">
              <PlusIcon className="w-3.5 h-3.5" /> Tambah Sekarang
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  )
}
