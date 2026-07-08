import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { getRekap } from '../../services/transaction.service'
import { getTransactions } from '../../services/transaction.service'
import { CATEGORIES } from '../../constants'
import { formatRupiah, formatPercent } from '../../utils/format'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = ['#2563EB', '#D97706', '#7C3AED', '#0891B2', '#059669', '#DC2626']

export default function RekapPage() {
  const { data: rekapRes, isLoading } = useQuery({
    queryKey: ['rekap'],
    queryFn: getRekap,
    select: r => r.data,
    staleTime: 2 * 60 * 1000,
  })

  const { data: txRes } = useQuery({
    queryKey: ['transactions', {}],
    queryFn: () => getTransactions({ limit: 9999 }),
    select: r => r.data?.data || [],
  })

  const grandTotal = rekapRes?.grandTotal || 0

  const rows = CATEGORIES.map((cat, i) => ({
    ...cat,
    subtotal: rekapRes?.[cat.id] || 0,
    count: txRes?.filter(t => t.kategori === cat.id).length || 0,
    color: COLORS[i],
  }))

  const pieData = rows.filter(r => r.subtotal > 0).map(r => ({
    name: r.label, value: r.subtotal, color: r.color,
  }))

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="page-title">Rekapitulasi</h1>

      {/* Grand total card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-5 text-white">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full" />
        <p className="text-sm text-primary-100">Grand Total Pengeluaran</p>
        {isLoading
          ? <div className="skeleton h-9 w-48 mt-1 bg-white/20" />
          : <p className="text-3xl font-extrabold mt-1">{formatRupiah(grandTotal)}</p>
        }
        <p className="text-xs text-primary-200 mt-2">{rows.filter(r => r.subtotal > 0).length} kategori aktif</p>
      </motion.div>

      {/* Pie chart */}
      {!isLoading && pieData.length > 0 && (
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Distribusi</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" paddingAngle={2}>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip
                formatter={(v) => formatRupiah(v)}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Category breakdown */}
      <div className="card">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Per Kategori</h2>
        <div className="space-y-4">
          {isLoading
            ? [1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-14 w-full" />)
            : rows.map((row, i) => (
              <motion.div key={row.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: row.color }} />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{row.label}</span>
                    <span className="text-xs text-slate-400">({row.count} transaksi)</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{formatRupiah(row.subtotal)}</p>
                    <p className="text-xs text-slate-400">{formatPercent(row.subtotal, grandTotal)}</p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: formatPercent(row.subtotal, grandTotal) }}
                    transition={{ delay: i * 0.05 + 0.2, duration: 0.5 }}
                    className="h-full rounded-full"
                    style={{ background: row.color, width: formatPercent(row.subtotal, grandTotal) }}
                  />
                </div>
              </motion.div>
            ))
          }
        </div>

        {!isLoading && (
          <>
            <div className="divider my-4" />
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800 dark:text-slate-200">Grand Total</span>
              <span className="text-xl font-extrabold text-primary-600">{formatRupiah(grandTotal)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
