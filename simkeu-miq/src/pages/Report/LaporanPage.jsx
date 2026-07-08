import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  DocumentArrowDownIcon, TableCellsIcon, PrinterIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline'
import { getTransactions, getRekap } from '../../services/transaction.service'
import { exportToPDF, exportToExcel, printReport } from '../../utils/export'
import { CATEGORIES, CATEGORY_MAP } from '../../constants'
import { formatRupiah, formatDate } from '../../utils/format'
import toast from 'react-hot-toast'

const ExportCard = ({ icon: Icon, title, desc, color, bg, onClick, id, loading }) => (
  <motion.button
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    id={id}
    disabled={loading}
    className="card flex items-center gap-4 w-full text-left hover:shadow-soft transition-shadow duration-200
               disabled:opacity-70 disabled:cursor-not-allowed">
    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
         style={{ background: bg }}>
      <Icon className="w-6 h-6" style={{ color }} />
    </div>
    <div className="flex-1">
      <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{title}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
    </div>
    <ArrowDownTrayIcon className="w-5 h-5 text-slate-400" />
  </motion.button>
)

export default function LaporanPage() {
  const [exporting, setExporting] = useState(null)

  const { data: txRes } = useQuery({
    queryKey: ['transactions', { limit: 9999 }],
    queryFn: () => getTransactions({ limit: 9999 }),
    select: r => r.data?.data || [],
  })

  const { data: rekapRes } = useQuery({
    queryKey: ['rekap'],
    queryFn: getRekap,
    select: r => r.data,
  })

  const handleExport = async (type) => {
    if (!txRes || !rekapRes) { toast.error('Data belum dimuat'); return }
    setExporting(type)
    try {
      if (type === 'pdf')   { await exportToPDF(txRes, rekapRes);   toast.success('PDF berhasil diunduh') }
      if (type === 'excel') { exportToExcel(txRes, rekapRes);        toast.success('Excel berhasil diunduh') }
      if (type === 'print') { printReport() }
    } catch (e) {
      toast.error('Gagal mengekspor: ' + e.message)
    } finally {
      setExporting(null)
    }
  }

  // Preview data
  const grandTotal = rekapRes?.grandTotal || 0
  const totalTx    = txRes?.length || 0

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="page-title no-print">Laporan & Export</h1>

      {/* Summary */}
      <div className="card bg-gradient-to-br from-slate-800 to-slate-900 text-white no-print">
        <p className="text-xs text-slate-400 mb-1">Ringkasan Laporan</p>
        <p className="text-2xl font-extrabold">{formatRupiah(grandTotal)}</p>
        <p className="text-xs text-slate-400 mt-1">{totalTx} transaksi dari {CATEGORIES.length} kategori</p>
      </div>

      {/* Export options */}
      <div className="space-y-3 no-print">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
          Format Export
        </p>
        <ExportCard
          id="btn-export-pdf"
          icon={DocumentArrowDownIcon}
          title="Export PDF"
          desc="Laporan lengkap per kategori, siap cetak A4"
          color="#DC2626" bg="#FEF2F2"
          onClick={() => handleExport('pdf')}
          loading={exporting === 'pdf'}
        />
        <ExportCard
          id="btn-export-excel"
          icon={TableCellsIcon}
          title="Export Excel (.xlsx)"
          desc="Semua data dalam format spreadsheet"
          color="#16a34a" bg="#f0fdf4"
          onClick={() => handleExport('excel')}
          loading={exporting === 'excel'}
        />
        <ExportCard
          id="btn-print"
          icon={PrinterIcon}
          title="Cetak / Print A4"
          desc="Buka dialog cetak browser"
          color="#2563EB" bg="#EFF6FF"
          onClick={() => handleExport('print')}
          loading={exporting === 'print'}
        />
      </div>

      {/* Print preview area */}
      <div id="print-area" className="card space-y-4 shadow-none border-0">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Preview Rekapitulasi</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 text-xs font-semibold text-slate-500 dark:text-slate-400">Kategori</th>
                <th className="text-right py-2 text-xs font-semibold text-slate-500 dark:text-slate-400">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {CATEGORIES.map(cat => (
                <tr key={cat.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2.5 text-slate-700 dark:text-slate-300">{cat.label}</td>
                  <td className="py-2.5 text-right font-medium text-slate-800 dark:text-slate-200">
                    {formatRupiah(rekapRes?.[cat.id] || 0)}
                  </td>
                </tr>
              ))}
              <tr className="bg-primary-50 dark:bg-primary-900/20">
                <td className="py-3 font-bold text-slate-900 dark:text-white">Grand Total</td>
                <td className="py-3 text-right font-extrabold text-primary-600 text-base">{formatRupiah(grandTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
