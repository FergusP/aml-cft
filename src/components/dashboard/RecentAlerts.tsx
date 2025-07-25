'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, TrendingUp, Activity, Users } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'
import { cn } from '@/lib/utils'

const alerts = [
  {
    id: 1,
    type: 'high_risk',
    icon: AlertTriangle,
    title: 'Wallet Risiko Tinggi Terdeteksi',
    description: '0x742d35Cc6634C0532925a3b844Bc9e7595f7E8E0 - Mixer interaction detected',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    severity: 'critical',
  },
  {
    id: 2,
    type: 'volume_spike',
    icon: TrendingUp,
    title: 'Lonjakan Volume Transaksi',
    description: 'Volume meningkat 300% dalam 1 jam di Ethereum network',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    severity: 'warning',
  },
  {
    id: 3,
    type: 'pattern',
    icon: Activity,
    title: 'Pola Layering Terdeteksi',
    description: 'Multiple small transactions detected between related wallets',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    severity: 'warning',
  },
  {
    id: 4,
    type: 'cluster',
    icon: Users,
    title: 'Kluster Wallet Mencurigakan',
    description: '15 wallet terhubung dengan pola transaksi serupa',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    severity: 'medium',
  },
]

const severityColors: Record<string, string> = {
  critical: 'bg-red-50 border-red-200 text-red-900',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
  medium: 'bg-blue-50 border-blue-200 text-blue-900',
}

const iconColors: Record<string, string> = {
  critical: 'text-red-600 bg-red-100',
  warning: 'text-yellow-600 bg-yellow-100',
  medium: 'text-blue-600 bg-blue-100',
}

export default function RecentAlerts() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-xl bg-white p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Alert Terbaru</h3>
        <button 
          onClick={() => window.location.href = '/alerts'}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Lihat Semua
        </button>
      </div>

      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={cn(
              'flex gap-4 rounded-lg border p-4 transition-all hover:shadow-md',
              severityColors[alert.severity]
            )}
          >
            <div className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg',
              iconColors[alert.severity]
            )}>
              <alert.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{alert.title}</h4>
              <p className="text-sm opacity-90 mt-0.5">{alert.description}</p>
              <p className="text-xs opacity-70 mt-2">
                {formatDistanceToNow(alert.timestamp, { addSuffix: true, locale: id })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}