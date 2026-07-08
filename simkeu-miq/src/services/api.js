import axios from 'axios'
import { GAS_URL, STORAGE_KEYS } from '../constants'
import toast from 'react-hot-toast'

// Demo mode: gunakan data lokal jika GAS_URL tidak dikonfigurasi
export const isDemoMode = !GAS_URL

const api = axios.create({
  timeout: 60000,
  headers: { 'Content-Type': 'text/plain;charset=utf-8' },
})

// Request interceptor — tambahkan token
api.interceptors.request.use(
  (config) => {
    // Stringify data if it's an object to avoid preflight issues while keeping it readable for GAS
    if (config.data && typeof config.data === 'object') {
      config.data = JSON.stringify(config.data)
    }
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    if (token) {
      config.params = { ...config.params, token }
    }
    return config
  },
  (err) => Promise.reject(err)
)

// Response interceptor — handle error global
api.interceptors.response.use(
  (res) => {
    // GAS always returns 200; check success flag
    if (res.data && res.data.success === false) {
      if (res.data.message && res.data.message.includes('Session tidak valid')) {
        localStorage.removeItem('simkeu_token')
        localStorage.removeItem('simkeu_user')
        window.location.href = '/login'
        return Promise.reject(new Error(res.data.message))
      }
      return Promise.reject(new Error(res.data.message || 'Terjadi kesalahan'))
    }
    return res.data
  },
  (err) => {
    if (!navigator.onLine) {
      toast.error('Tidak ada koneksi internet')
    } else if (err.code === 'ECONNABORTED') {
      toast.error('Koneksi lambat, coba lagi')
    } else if (err.response?.status === 401) {
      localStorage.removeItem('simkeu_token')
      localStorage.removeItem('simkeu_user')
      window.location.href = '/login'
    } else {
      toast.error(err.message || 'Gagal terhubung ke server')
    }
    return Promise.reject(err)
  }
)

export default api
