import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MagnifyingGlassIcon, FunnelIcon, PencilSquareIcon,
  TrashIcon, EyeIcon, PlusIcon, XMarkIcon,
} from '@heroicons/react/24/outline'
import { getTransactions, deleteTransaction } from '../../services/transaction.service'
import { CATEGORIES, CATEGORY_MAP } from '../../constants'
import { formatRupiah, formatDateShort, debounce } from '../../utils/format'
import toast from 'react-hot-toast'

const DeleteDialog = ({ transaction, onConfirm, onCancel, isLoading }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <motion.div
      initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      exit={{ y: 40, opacity: 0 }}
      className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
      <h3 className="font-bold text-slate-900 dark:text-white mb-2">Hapus Transaksi?</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
        <strong className="text-slate-700 dark:text-slate-300">{transaction?.uraian}</strong>
        {' '}akan dihapus secara permanen.
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="btn-secondary flex-1" disabled={isLoading}>Batal</button>
        <button onClick={onConfirm} className="btn-danger flex-1" disabled={isLoading}>
          {isLoading ? 'Menghapus...' : 'Hapus'}
        </button>
      </div>
    </motion.div>
  </motion.div>
)

const TransactionCard = ({ t, onDelete }) => {
  const cat = CATEGORY_MAP[t.kategori]
  return (
    <motion.div layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="card group hover:shadow-soft transition-all duration-200">
      <div className="flex items-start gap-3">
        {/* Category badge */}
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
             style={{ background: cat?.bg || '#f1f5f9' }}>
          <div className="w-3 h-3 rounded-full" style={{ background: cat?.color || '#94a3b8' }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{t.uraian}</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white flex-shrink-0">
              {formatRupiah(t.jumlah)}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: cat?.bg, color: cat?.color }}>
              {cat?.label || t.kategori}
            </span>
            <span className="text-xs text-slate-400">{formatDateShort(t.tanggal)}</span>
            {t.nomorNota && (
              <span className="text-xs text-slate-400">#{t.nomorNota}</span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {t.volume} {t.satuan} × {formatRupiah(t.harga)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
        <Link to={`/transaksi/${t.id}`} id={`btn-detail-${t.id}`}
          className="btn-ghost flex-1 text-xs py-1.5 gap-1">
          <EyeIcon className="w-3.5 h-3.5" /> Detail
        </Link>
        <Link to={`/transaksi/${t.id}/edit`} id={`btn-edit-${t.id}`}
          className="btn-ghost flex-1 text-xs py-1.5 gap-1 text-blue-600 dark:text-blue-400">
          <PencilSquareIcon className="w-3.5 h-3.5" /> Edit
        </Link>
        <button onClick={() => onDelete(t)} id={`btn-delete-${t.id}`}
          className="btn-ghost flex-1 text-xs py-1.5 gap-1 text-red-500">
          <TrashIcon className="w-3.5 h-3.5" /> Hapus
        </button>
      </div>
    </motion.div>
  )
}

export default function TransactionListPage() {
  const queryClient = useQueryClient()
  const [search, setSearch]       = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [kategori, setKategori]   = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [page, setPage]           = useState(1)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(debounce((v) => { setSearch(v); setPage(1) }, 400), [])

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['transactions', { search, kategori, page }],
    queryFn: () => getTransactions({ search, kategori, page, limit: 15 }),
    keepPreviousData: true,
    select: r => r,
  })

  const deleteMut = useMutation({
    mutationFn: (id) => deleteTransaction(id),
    onSuccess: () => {
      toast.success('Transaksi berhasil dihapus')
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setDeleteTarget(null)
    },
    onError: (e) => toast.error(e.message),
  })

  const transactions = data?.data?.data || []
  const total = data?.data?.total || 0

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="page-title">Daftar Transaksi</h1>
        <Link to="/transaksi/tambah" id="list-btn-tambah"
          className="btn-primary text-xs px-3 py-2 gap-1">
          <PlusIcon className="w-4 h-4" /> Tambah
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          id="input-search-transaksi"
          type="text"
          placeholder="Cari uraian, nomor nota..."
          value={searchInput}
          onChange={e => { setSearchInput(e.target.value); debouncedSearch(e.target.value) }}
          className="input pl-10 pr-10"
        />
        {searchInput && (
          <button onClick={() => { setSearchInput(''); setSearch(''); setPage(1) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
        <button
          onClick={() => { setKategori(''); setPage(1) }}
          className={`chip flex-shrink-0 ${!kategori ? 'chip-active' : 'chip-inactive'}`}>
          Semua
        </button>
        {CATEGORIES.map(cat => (
          <button key={cat.id}
            onClick={() => { setKategori(cat.id === kategori ? '' : cat.id); setPage(1) }}
            className={`chip flex-shrink-0 ${kategori === cat.id ? 'chip-active' : 'chip-inactive'}`}>
            {cat.label.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{isFetching ? 'Memuat...' : `${total} transaksi`}</span>
        {(search || kategori) && (
          <button onClick={() => { setSearch(''); setSearchInput(''); setKategori(''); setPage(1) }}
            className="text-primary-600 flex items-center gap-1 hover:underline">
            <XMarkIcon className="w-3 h-3" /> Reset filter
          </button>
        )}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="card space-y-3">
              <div className="flex gap-3">
                <div className="skeleton w-10 h-10 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-3 w-1/2" />
                  <div className="skeleton h-3 w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 gap-3">
          <FunnelIcon className="w-12 h-12 text-slate-300 dark:text-slate-600" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {search || kategori ? 'Tidak ada hasil ditemukan' : 'Belum ada transaksi'}
          </p>
          {!search && !kategori && (
            <Link to="/transaksi/tambah" id="empty-btn-tambah" className="btn-primary text-sm px-4 py-2">
              Tambah Transaksi Pertama
            </Link>
          )}
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {transactions.map(t => (
              <TransactionCard key={t.id} t={t} onDelete={setDeleteTarget} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {total > 15 && (
        <div className="flex justify-center gap-3 pt-2">
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
            className="btn-secondary text-sm px-4 py-2 disabled:opacity-50">← Sebelumnya</button>
          <span className="flex items-center text-sm text-slate-500">Halaman {page}</span>
          <button onClick={() => setPage(p => p+1)} disabled={transactions.length < 15}
            className="btn-secondary text-sm px-4 py-2 disabled:opacity-50">Berikutnya →</button>
        </div>
      )}

      {/* Delete Dialog */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteDialog
            transaction={deleteTarget}
            onConfirm={() => deleteMut.mutate(deleteTarget.id)}
            onCancel={() => setDeleteTarget(null)}
            isLoading={deleteMut.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
