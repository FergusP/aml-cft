'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Search, 
  AlertTriangle, 
  FileText, 
  Settings,
  Shield,
  Activity,
  TrendingUp,
  Users,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useConfirmModal, useAlertModal } from '@/hooks/useModal'
import { ConfirmModal, AlertModal } from '@/components/ui/Modal'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Analisis Wallet', href: '/wallet', icon: Search },
  { name: 'Alert Center', href: '/alerts', icon: AlertTriangle },
  { name: 'Transaction Monitoring', href: '/transactions', icon: Activity },
  { name: 'Investigation Tools', href: '/investigation', icon: Shield },
  { name: 'Risk Scoring', href: '/risk-scoring', icon: TrendingUp },
  { name: 'Laporan', href: '/reports', icon: FileText },
]

const secondaryNavigation = [
  { name: 'Tim Investigasi', href: '/teams', icon: Users },
  { name: 'Pengaturan', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const confirmModal = useConfirmModal()
  const alertModal = useAlertModal()

  const handleLogout = () => {
    confirmModal.showConfirm({
      title: 'Konfirmasi Logout',
      message: 'Apakah Anda yakin ingin keluar dari sistem?',
      confirmText: 'Logout',
      cancelText: 'Batal',
      type: 'warning',
      onConfirm: () => {
        alertModal.showAlert({
          type: 'success',
          title: 'Logout Berhasil',
          message: 'Anda telah berhasil keluar dari sistem.',
          onConfirm: () => {
            window.location.href = '/'
          }
        })
      }
    })
  }

  return (
    <div className="flex h-screen w-64 flex-col bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border-r border-gray-800">
      <div className="flex h-16 items-center px-6 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-600/20">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">SARK</h1>
            <p className="text-xs text-gray-400">BI-OJK Compliance</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30'
                    : 'text-gray-300 hover:bg-gray-800/50 hover:text-white hover:translate-x-1'
                )}
              >
                <item.icon className={cn(
                  'h-5 w-5 flex-shrink-0 transition-all duration-200',
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                )} />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>

        <div className="pt-6">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Administrasi
          </p>
          <div className="mt-3 space-y-1">
            {secondaryNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30'
                      : 'text-gray-300 hover:bg-gray-800/50 hover:text-white hover:translate-x-1'
                  )}
                >
                  <item.icon className={cn(
                    'h-5 w-5 flex-shrink-0 transition-all duration-200',
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                  )} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm px-3 py-3 border border-gray-700/50">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
            AD
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Admin OJK</p>
            <p className="text-xs text-gray-400">admin@ojk.go.id</p>
          </div>
          <button 
            onClick={handleLogout}
            className="text-gray-400 hover:text-white hover:bg-gray-700/50 p-2 rounded-lg transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.close}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        type={confirmModal.type}
        onConfirm={confirmModal.onConfirm!}
      />
      
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={alertModal.close}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        onConfirm={alertModal.onConfirm}
      />
    </div>
  )
}