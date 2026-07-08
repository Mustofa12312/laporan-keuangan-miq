import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ProtectedRoute, GuestRoute } from './routes'
import { AppLayout } from './layouts/AppLayout'

// Lazy load pages
const LoginPage           = lazy(() => import('./pages/Login/LoginPage'))
const DashboardPage       = lazy(() => import('./pages/Dashboard/DashboardPage'))
const TransactionListPage = lazy(() => import('./pages/Transaction/TransactionListPage'))
const TransactionFormPage = lazy(() => import('./pages/Transaction/TransactionFormPage'))
const TransactionDetailPage = lazy(() => import('./pages/Transaction/TransactionDetailPage'))
const RekapPage           = lazy(() => import('./pages/Report/RekapPage'))
const LaporanPage         = lazy(() => import('./pages/Report/LaporanPage'))
const RiwayatPage         = lazy(() => import('./pages/Riwayat/RiwayatPage'))
const PengaturanPage      = lazy(() => import('./pages/Setting/PengaturanPage'))

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  </div>
)

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Guest only */}
                <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />

                {/* Protected */}
                <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                  <Route index                        element={<DashboardPage />} />
                  <Route path="transaksi"             element={<TransactionListPage />} />
                  <Route path="transaksi/tambah"      element={<TransactionFormPage />} />
                  <Route path="transaksi/:id"         element={<TransactionDetailPage />} />
                  <Route path="transaksi/:id/edit"    element={<TransactionFormPage />} />
                  <Route path="rekapitulasi"          element={<RekapPage />} />
                  <Route path="laporan"               element={<LaporanPage />} />
                  <Route path="riwayat"               element={<RiwayatPage />} />
                  <Route path="pengaturan"            element={<PengaturanPage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>

            <Toaster
              position="top-center"
              containerStyle={{ top: 16 }}
              toastOptions={{
                duration: 3000,
                style: {
                  borderRadius: '16px',
                  background: 'var(--toast-bg, #1e293b)',
                  color: '#f1f5f9',
                  fontSize: '14px',
                  fontWeight: '500',
                  padding: '12px 16px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                },
                success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
                error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
              }}
            />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
