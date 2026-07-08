import api, { isDemoMode } from './api'
import { GAS_URL, STORAGE_KEYS } from '../constants'


// ===== DEMO USERS =====
const DEMO_USERS = [
  { id: '1', username: 'ketua',     password: 'miq2026', nama: 'Ahmad Fauzi',    jabatan: 'Ketua',      status: 'Aktif' },
  { id: '2', username: 'bendahara', password: 'miq2026', nama: 'Siti Aisyah',    jabatan: 'Bendahara',  status: 'Aktif' },
  { id: '3', username: 'sekretaris',password: 'miq2026', nama: 'Muhammad Hasan', jabatan: 'Sekretaris', status: 'Aktif' },
]

const saveSession = (user, token) => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token)
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
}

export const login = async ({ username, password }) => {
  if (isDemoMode) {
    const user = DEMO_USERS.find(
      u => u.username === username && u.password === password && u.status === 'Aktif'
    )
    if (!user) throw new Error('Username atau Password salah')
    const token = `demo-${user.id}-${Date.now()}`
    saveSession({ nama: user.nama, jabatan: user.jabatan, username: user.username }, token)
    return { user, token }
  }

  const res = await api.post(GAS_URL, { username, password }, { params: { action: 'login' } })
  saveSession(res.user, res.token)
  return res
}

export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN)
  localStorage.removeItem(STORAGE_KEYS.USER)
}

export const getSession = () => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
  const userStr = localStorage.getItem(STORAGE_KEYS.USER)
  if (!token || !userStr) return null
  try {
    return { token, user: JSON.parse(userStr) }
  } catch {
    return null
  }
}
