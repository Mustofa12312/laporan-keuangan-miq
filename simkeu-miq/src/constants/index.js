// Kategori tetap sesuai PRD BR-003
export const CATEGORIES = [
  { id: 'kesekretariatan', label: 'Kesekretariatan',   sheet: 'KESEKRETARIATAN', color: '#2563EB', bg: '#EFF6FF' },
  { id: 'konsumsi',        label: 'Konsumsi',           sheet: 'KONSUMSI',         color: '#D97706', bg: '#FFFBEB' },
  { id: 'honorarium',      label: 'Honorarium & Transportasi', sheet: 'HONORARIUM', color: '#7C3AED', bg: '#F5F3FF' },
  { id: 'perlengkapan',    label: 'Perlengkapan Acara', sheet: 'PERLENGKAPAN',     color: '#0891B2', bg: '#ECFEFF' },
  { id: 'publikasi',       label: 'Publikasi & Dokumentasi', sheet: 'PUBLIKASI',   color: '#059669', bg: '#ECFDF5' },
  { id: 'lainlain',        label: 'Lain-lain',          sheet: 'LAIN-LAIN',        color: '#DC2626', bg: '#FEF2F2' },
]

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c]))
export const CATEGORY_SHEET_MAP = Object.fromEntries(CATEGORIES.map(c => [c.sheet, c]))

// Satuan yang umum digunakan
export const UNITS = [
  'Orang', 'Buah', 'Paket', 'Set', 'Lembar', 'Rim', 'Botol',
  'Porsi', 'Dus', 'Lusin', 'Meter', 'Kg', 'Liter', 'Unit', 'Kali',
]

// Jabatan pengguna
export const ROLES = ['Ketua', 'Bendahara', 'Sekretaris']

// Status pengguna
export const USER_STATUS = { ACTIVE: 'Aktif', INACTIVE: 'Nonaktif' }

// Jenis aksi audit log
export const AUDIT_ACTIONS = {
  LOGIN:  'Login',
  LOGOUT: 'Logout',
  ADD:    'Tambah',
  EDIT:   'Edit',
  DELETE: 'Hapus',
  EXPORT: 'Export',
}

// Key untuk localStorage
export const STORAGE_KEYS = {
  TOKEN:    'simkeu_token',
  USER:     'simkeu_user',
  THEME:    'simkeu_theme',
  REMIND_NOTA: 'simkeu_remind_nota',
}

// GAS API base URL — ganti dengan URL deploy GAS Anda
export const GAS_URL = import.meta.env.VITE_GAS_URL || ''
