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

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900">
      <div className="flex h-16 items-center px-6 bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">SARK</h1>
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
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                )}
              >
                <item.icon className={cn(
                  'h-5 w-5 flex-shrink-0 transition-colors',
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                )} />
                {item.name}
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
                    'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  )}
                >
                  <item.icon className={cn(
                    'h-5 w-5 flex-shrink-0 transition-colors',
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                  )} />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-gray-800 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
            AD
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Admin OJK</p>
            <p className="text-xs text-gray-400">admin@ojk.go.id</p>
          </div>
          <button 
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin logout?')) {
                alert('Logout berhasil!')
                window.location.href = '/'
              }
            }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}