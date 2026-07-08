import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { EyeIcon, EyeSlashIcon, BanknotesIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { login } from '../../services/auth.service'
import { useAuth } from '../../context/AuthContext'
import { isDemoMode } from '../../services/api'

const schema = z.object({
  username: z.string().min(1, 'Username wajib diisi'),
  password: z.string().min(1, 'Password wajib diisi'),
})

export default function LoginPage() {
  const { login: setAuth } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPass, setShowPass] = useState(false)
  const [serverError, setServerError] = useState('')
  const from = location.state?.from?.pathname || '/'

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { username: '', password: '' },
  })

  const onSubmit = async (data) => {
    setServerError('')
    try {
      const res = await login(data)
      setAuth(res.user)
      navigate(from, { replace: true })
    } catch (err) {
      setServerError(err.message || 'Login gagal, coba lagi')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center
                    bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950
                    px-4 py-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm relative z-10">

        {/* Logo & Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
            className="inline-flex w-20 h-20 items-center justify-center
                       bg-primary-600 rounded-3xl shadow-glow mb-4">
            <BanknotesIcon className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white">SIMKEU MIQ</h1>
          <p className="text-slate-400 text-sm mt-1">Sistem Informasi Manajemen Keuangan</p>
          <p className="text-slate-500 text-xs mt-0.5">Kursus MIQ se-Madura</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md
                        border border-white/20 rounded-3xl p-6 shadow-2xl">

          {/* Demo mode banner */}
          {isDemoMode && (
            <div className="mb-4 p-3 bg-amber-500/20 border border-amber-500/30 rounded-2xl">
              <p className="text-xs text-amber-300 font-medium text-center">
                🎭 Mode Demo — gunakan: <strong>bendahara</strong> / <strong>miq2026</strong>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="form-login" noValidate>
            {/* Username */}
            <div className="form-group">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Username
              </label>
              <input
                {...register('username')}
                id="input-username"
                type="text"
                autoComplete="username"
                autoFocus
                placeholder="Masukkan username"
                className={`w-full bg-white/10 border text-white text-sm rounded-2xl px-4 py-3
                            placeholder:text-slate-500 outline-none transition-all duration-200
                            focus:ring-2 focus:ring-primary-500/40 focus:bg-white/15
                            ${errors.username ? 'border-red-400' : 'border-white/20 focus:border-primary-500'}`}
              />
              {errors.username && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <ExclamationCircleIcon className="w-3.5 h-3.5" />
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  id="input-password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Masukkan password"
                  className={`w-full bg-white/10 border text-white text-sm rounded-2xl px-4 py-3 pr-12
                              placeholder:text-slate-500 outline-none transition-all duration-200
                              focus:ring-2 focus:ring-primary-500/40 focus:bg-white/15
                              ${errors.password ? 'border-red-400' : 'border-white/20 focus:border-primary-500'}`}
                />
                <button
                  type="button"
                  id="btn-toggle-password"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1">
                  {showPass ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <ExclamationCircleIcon className="w-3.5 h-3.5" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Server error */}
            <AnimatePresence>
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-red-500/20 border border-red-500/30 rounded-2xl">
                  <p className="text-xs text-red-300 flex items-center gap-1.5">
                    <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />
                    {serverError}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              id="btn-login"
              disabled={isSubmitting}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold
                         py-3.5 rounded-2xl transition-all duration-200 shadow-glow
                         flex items-center justify-center gap-2
                         disabled:opacity-70 disabled:cursor-not-allowed">
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Masuk...
                </>
              ) : 'Masuk'}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          © 2026 SIMKEU MIQ · Kursus MIQ se-Madura
        </p>
      </motion.div>
    </div>
  )
}
