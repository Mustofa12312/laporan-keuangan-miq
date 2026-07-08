import api, { isDemoMode } from './api'
import { generateId } from '../utils/format'
import { formatDateInput } from '../utils/format'

// ===== DEMO DATA STORE =====
const DEMO_STORAGE_KEY = 'simkeu_demo_transactions'

const getDemo = () => {
  try {
    const d = localStorage.getItem(DEMO_STORAGE_KEY)
    return d ? JSON.parse(d) : generateDemoData()
  } catch { return generateDemoData() }
}

const saveDemo = (data) => {
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(data))
}

const generateDemoData = () => {
  const today = new Date()
  const fmt = (offsetDays) => {
    const d = new Date(today)
    d.setDate(d.getDate() - offsetDays)
    return formatDateInput(d)
  }

  const demos = [
    { id: generateId(), tanggal: fmt(0),  kategori: 'konsumsi',       uraian: 'Makan Siang Peserta',  volume: 200, satuan: 'Porsi', harga: 20000,  jumlah: 4000000, nomorNota: 'NOT-001', catatan: '', dibuatOleh: 'bendahara', dibuatPada: new Date(today).toISOString() },
    { id: generateId(), tanggal: fmt(1),  kategori: 'kesekretariatan',uraian: 'Cetak Undangan',        volume: 300, satuan: 'Lembar',harga: 500,    jumlah: 150000,  nomorNota: 'NOT-002', catatan: '', dibuatOleh: 'bendahara', dibuatPada: new Date(today).toISOString() },
    { id: generateId(), tanggal: fmt(2),  kategori: 'honorarium',     uraian: 'Honor Pembicara Utama', volume: 1,   satuan: 'Orang', harga: 1500000, jumlah: 1500000, nomorNota: 'NOT-003', catatan: 'Kwitansi terlampir', dibuatOleh: 'ketua', dibuatPada: new Date(today).toISOString() },
    { id: generateId(), tanggal: fmt(2),  kategori: 'konsumsi',       uraian: 'Snack Coffee Break',   volume: 200, satuan: 'Paket', harga: 8000,   jumlah: 1600000, nomorNota: 'NOT-004', catatan: '', dibuatOleh: 'bendahara', dibuatPada: new Date(today).toISOString() },
    { id: generateId(), tanggal: fmt(3),  kategori: 'perlengkapan',   uraian: 'Sewa Sound System',    volume: 1,   satuan: 'Paket', harga: 2500000, jumlah: 2500000, nomorNota: 'NOT-005', catatan: '', dibuatOleh: 'sekretaris', dibuatPada: new Date(today).toISOString() },
    { id: generateId(), tanggal: fmt(4),  kategori: 'publikasi',      uraian: 'Spanduk Banner',       volume: 3,   satuan: 'Buah',  harga: 150000, jumlah: 450000,  nomorNota: 'NOT-006', catatan: '', dibuatOleh: 'sekretaris', dibuatPada: new Date(today).toISOString() },
    { id: generateId(), tanggal: fmt(5),  kategori: 'kesekretariatan',uraian: 'ATK & Alat Tulis',     volume: 1,   satuan: 'Paket', harga: 250000, jumlah: 250000,  nomorNota: 'NOT-007', catatan: '', dibuatOleh: 'bendahara', dibuatPada: new Date(today).toISOString() },
    { id: generateId(), tanggal: fmt(5),  kategori: 'honorarium',     uraian: 'Transport Panitia',    volume: 10,  satuan: 'Orang', harga: 200000, jumlah: 2000000, nomorNota: 'NOT-008', catatan: '', dibuatOleh: 'ketua', dibuatPada: new Date(today).toISOString() },
    { id: generateId(), tanggal: fmt(6),  kategori: 'lainlain',       uraian: 'Biaya Tak Terduga',    volume: 1,   satuan: 'Paket', harga: 300000, jumlah: 300000,  nomorNota: '',        catatan: 'Tanpa nota', dibuatOleh: 'bendahara', dibuatPada: new Date(today).toISOString() },
    { id: generateId(), tanggal: fmt(7),  kategori: 'konsumsi',       uraian: 'Makan Malam Peserta',  volume: 200, satuan: 'Porsi', harga: 25000,  jumlah: 5000000, nomorNota: 'NOT-009', catatan: '', dibuatOleh: 'bendahara', dibuatPada: new Date(today).toISOString() },
    { id: generateId(), tanggal: fmt(8),  kategori: 'perlengkapan',   uraian: 'Sewa Meja & Kursi',    volume: 50,  satuan: 'Set',   harga: 15000,  jumlah: 750000,  nomorNota: 'NOT-010', catatan: '', dibuatOleh: 'sekretaris', dibuatPada: new Date(today).toISOString() },
    { id: generateId(), tanggal: fmt(9),  kategori: 'publikasi',      uraian: 'Dokumentasi Foto',     volume: 1,   satuan: 'Paket', harga: 500000, jumlah: 500000,  nomorNota: 'NOT-011', catatan: '', dibuatOleh: 'sekretaris', dibuatPada: new Date(today).toISOString() },
    { id: generateId(), tanggal: fmt(10), kategori: 'kesekretariatan',uraian: 'Fotokopi Materi',      volume: 500, satuan: 'Lembar',harga: 200,    jumlah: 100000,  nomorNota: 'NOT-012', catatan: '', dibuatOleh: 'bendahara', dibuatPada: new Date(today).toISOString() },
  ]
  saveDemo(demos)
  return demos
}

// ===== SERVICE METHODS =====

export const getTransactions = async (params = {}) => {
  if (isDemoMode) {
    let data = getDemo()
    const { search, kategori, tanggal, page = 1, limit = 20 } = params
    if (search)   data = data.filter(t => t.uraian?.toLowerCase().includes(search.toLowerCase()) || t.nomorNota?.includes(search))
    if (kategori) data = data.filter(t => t.kategori === kategori)
    if (tanggal)  data = data.filter(t => t.tanggal === tanggal)
    data.sort((a, b) => new Date(b.dibuatPada) - new Date(a.dibuatPada))
    const total = data.length
    const paginated = data.slice((page - 1) * limit, page * limit)
    return { data: paginated, total, page, limit }
  }
  return api.get(GAS_URL, { params: { ...params, action: 'transactions' } })
}

export const getTransaction = async (id) => {
  if (isDemoMode) {
    const t = getDemo().find(t => t.id === id)
    if (!t) throw new Error('Transaksi tidak ditemukan')
    return { data: t }
  }
  return api.get(GAS_URL, { params: { action: 'transaction', id } })
}

export const addTransaction = async (payload) => {
  if (isDemoMode) {
    const user = JSON.parse(localStorage.getItem('simkeu_user') || '{}')
    const newItem = {
      ...payload,
      id: generateId(),
      jumlah: Number(payload.volume) * Number(payload.harga),
      dibuatOleh: user.username || 'demo',
      dibuatPada: new Date().toISOString(),
    }
    const all = getDemo()
    all.unshift(newItem)
    saveDemo(all)
    addLog('Tambah', payload.kategori, null, newItem)
    return { success: true, message: 'Data berhasil disimpan', data: newItem }
  }
  return api.post(GAS_URL, payload, { params: { action: 'addTransaction' } })
}

export const updateTransaction = async (id, payload) => {
  if (isDemoMode) {
    const all = getDemo()
    const idx = all.findIndex(t => t.id === id)
    if (idx === -1) throw new Error('Transaksi tidak ditemukan')
    const oldData = { ...all[idx] }
    all[idx] = {
      ...all[idx],
      ...payload,
      jumlah: Number(payload.volume) * Number(payload.harga),
    }
    saveDemo(all)
    addLog('Edit', payload.kategori, oldData, all[idx])
    return { success: true, message: 'Data berhasil diperbarui', data: all[idx] }
  }
  return api.post(GAS_URL, payload, { params: { action: 'updateTransaction', id } })
}

export const deleteTransaction = async (id) => {
  if (isDemoMode) {
    const all = getDemo()
    const idx = all.findIndex(t => t.id === id)
    if (idx === -1) throw new Error('Transaksi tidak ditemukan')
    const old = all[idx]
    all.splice(idx, 1)
    saveDemo(all)
    addLog('Hapus', old.kategori, old, null)
    return { success: true, message: 'Data berhasil dihapus' }
  }
  return api.post(GAS_URL, null, { params: { action: 'deleteTransaction', id } })
}

// ===== REKAP =====
export const getRekap = async () => {
  if (isDemoMode) {
    const all = getDemo()
    const categories = ['kesekretariatan', 'konsumsi', 'honorarium', 'perlengkapan', 'publikasi', 'lainlain']
    const rekap = {}
    categories.forEach(cat => {
      rekap[cat] = all.filter(t => t.kategori === cat).reduce((s, t) => s + (t.jumlah || 0), 0)
    })
    rekap.grandTotal = Object.values(rekap).reduce((a, b) => a + b, 0)
    return { data: rekap }
  }
  return api.get(GAS_URL, { params: { action: 'rekap' } })
}

// ===== DASHBOARD =====
export const getDashboard = async () => {
  if (isDemoMode) {
    const all = getDemo()
    const categories = ['kesekretariatan', 'konsumsi', 'honorarium', 'perlengkapan', 'publikasi', 'lainlain']
    const rekapMap = {}
    categories.forEach(cat => {
      rekapMap[cat] = all.filter(t => t.kategori === cat).reduce((s, t) => s + (t.jumlah || 0), 0)
    })
    const grandTotal = Object.values(rekapMap).reduce((a, b) => a + b, 0)
    const topCategory = Object.entries(rekapMap).sort((a, b) => b[1] - a[1])[0]
    const sorted = [...all].sort((a, b) => new Date(b.dibuatPada) - new Date(a.dibuatPada))

    return {
      data: {
        totalPengeluaran: grandTotal,
        jumlahTransaksi: all.length,
        jumlahNota: all.filter(t => t.nomorNota).length,
        kategoriTerbesar: topCategory?.[0] || '-',
        rekap: rekapMap,
        transaksiTerbaru: sorted.slice(0, 10),
      }
    }
  }
  return api.get(GAS_URL, { params: { action: 'dashboard' } })
}

// ===== AUDIT LOG =====
const LOG_KEY = 'simkeu_logs'

export const addLog = (aksi, kategori, dataLama, dataBaru) => {
  const user = JSON.parse(localStorage.getItem('simkeu_user') || '{}')
  const logs = getLogs()
  logs.unshift({
    id: generateId(),
    waktu: new Date().toISOString(),
    user: user.username || 'demo',
    aksi,
    kategori,
    dataLama: dataLama ? JSON.stringify(dataLama) : null,
    dataBaru: dataBaru ? JSON.stringify(dataBaru) : null,
  })
  localStorage.setItem(LOG_KEY, JSON.stringify(logs.slice(0, 200)))
}

export const getLogs = (params = {}) => {
  try {
    const all = JSON.parse(localStorage.getItem(LOG_KEY) || '[]')
    const { page = 1, limit = 20 } = params
    return { data: all.slice((page - 1) * limit, page * limit), total: all.length }
  } catch { return { data: [], total: 0 } }
}
