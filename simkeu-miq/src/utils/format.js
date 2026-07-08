// ====== FORMAT RUPIAH ======
export const formatRupiah = (amount) => {
  if (!amount && amount !== 0) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatRupiahShort = (amount) => {
  if (!amount && amount !== 0) return 'Rp 0'
  if (amount >= 1_000_000_000) return `Rp ${(amount / 1_000_000_000).toFixed(1)}M`
  if (amount >= 1_000_000)     return `Rp ${(amount / 1_000_000).toFixed(1)}Jt`
  if (amount >= 1_000)         return `Rp ${(amount / 1_000).toFixed(0)}rb`
  return formatRupiah(amount)
}

// ====== FORMAT DATE ======
export const formatDate = (dateStr, options = {}) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  const defaults = { day: 'numeric', month: 'long', year: 'numeric' }
  return d.toLocaleDateString('id-ID', { ...defaults, ...options })
}

export const formatDateShort = (dateStr) =>
  formatDate(dateStr, { day: '2-digit', month: 'short', year: 'numeric' })

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export const formatDateInput = (date = new Date()) => {
  const d = new Date(date)
  return d.toISOString().split('T')[0] // YYYY-MM-DD for input[type=date]
}

export const formatDateDisplay = (dateStr) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

// ====== PARSE RUPIAH ======
export const parseRupiah = (str) =>
  Number(String(str).replace(/[^0-9]/g, '')) || 0

// ====== NUMBER ======
export const formatNumber = (n) =>
  new Intl.NumberFormat('id-ID').format(n || 0)

// ====== PERCENTAGE ======
export const formatPercent = (value, total) => {
  if (!total || total === 0) return '0%'
  return ((value / total) * 100).toFixed(1) + '%'
}

// ====== TIME AGO ======
export const timeAgo = (dateStr) => {
  if (!dateStr) return ''
  const now = new Date()
  const date = new Date(dateStr)
  const diff = now - date
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 1)   return 'Baru saja'
  if (mins < 60)  return `${mins} menit lalu`
  if (hours < 24) return `${hours} jam lalu`
  if (days < 7)   return `${days} hari lalu`
  return formatDateShort(dateStr)
}

// ====== TRUNCATE ======
export const truncate = (str, max = 40) =>
  str && str.length > max ? str.substring(0, max) + '…' : str

// ====== GENERATE ID ======
export const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`

// ====== DEBOUNCE ======
export const debounce = (fn, delay = 300) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
