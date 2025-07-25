'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { AlertTriangle, Filter, Download, ChevronDown, Search, Clock, TrendingUp, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { useAlertModal } from '@/hooks/useModal'
import { AlertModal } from '@/components/ui/Modal'
import AdvancedSearch from '@/components/search/AdvancedSearch'

interface Alert {
  id: string
  timestamp: Date
  type: 'high_risk' | 'suspicious_pattern' | 'velocity' | 'mixer' | 'sanctions'
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  walletAddress?: string
  amount?: number
  status: 'new' | 'investigating' | 'resolved' | 'false_positive'
}

const mockAlerts: Alert[] = [
  {
    id: 'ALT-2024-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    type: 'high_risk',
    severity: 'critical',
    title: 'Wallet Risiko Sangat Tinggi Terdeteksi',
    description: 'Wallet melakukan transaksi dengan multiple mixer services dalam 24 jam terakhir',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f7E8E0',
    amount: 150000000000,
    status: 'new'
  },
  {
    id: 'ALT-2024-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    type: 'suspicious_pattern',
    severity: 'high',
    title: 'Pola Layering Terdeteksi',
    description: 'Terdeteksi 45 transaksi kecil dalam 2 jam dengan pattern yang mencurigakan',
    walletAddress: '0x1234567890123456789012345678901234567890',
    amount: 45000000000,
    status: 'investigating'
  },
  {
    id: 'ALT-2024-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    type: 'velocity',
    severity: 'medium',
    title: 'Velocity Anomaly',
    description: 'Kecepatan transaksi meningkat 500% dari baseline normal',
    walletAddress: '0xABCDEF1234567890ABCDEF1234567890ABCDEF12',
    status: 'new'
  },
  {
    id: 'ALT-2024-004',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    type: 'sanctions',
    severity: 'critical',
    title: 'Koneksi ke OFAC Sanctioned Wallet',
    description: 'Wallet melakukan transaksi dengan address yang ada di OFAC sanctions list',
    walletAddress: '0x9876543210987654321098765432109876543210',
    amount: 25000000000,
    status: 'investigating'
  },
  {
    id: 'ALT-2024-005',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    type: 'mixer',
    severity: 'high',
    title: 'Tornado Cash Interaction',
    description: 'Direct interaction dengan Tornado Cash mixer contract terdeteksi',
    walletAddress: '0xFEDCBA9876543210FEDCBA9876543210FEDCBA98',
    amount: 80000000000,
    status: 'resolved'
  }
]

const severityColors = {
  critical: 'bg-red-100 text-red-800 border-red-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-blue-100 text-blue-800 border-blue-200'
}

const statusColors = {
  new: 'bg-red-100 text-red-800',
  investigating: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  false_positive: 'bg-gray-100 text-gray-800'
}

const typeIcons = {
  high_risk: AlertTriangle,
  suspicious_pattern: TrendingUp,
  velocity: Clock,
  mixer: AlertTriangle,
  sanctions: AlertTriangle
}

export default function AlertCenter() {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, any>>({})
  const alertModal = useAlertModal()

  const alertFilters = [
    {
      type: 'select' as const,
      key: 'severity',
      label: 'Severity',
      options: [
        { value: 'all', label: 'All Severities' },
        { value: 'critical', label: 'Critical' },
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' }
      ]
    },
    {
      type: 'select' as const,
      key: 'status',
      label: 'Status',
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'new', label: 'New' },
        { value: 'investigating', label: 'Investigating' },
        { value: 'resolved', label: 'Resolved' },
        { value: 'false_positive', label: 'False Positive' }
      ]
    },
    {
      type: 'select' as const,
      key: 'type',
      label: 'Alert Type',
      options: [
        { value: 'all', label: 'All Types' },
        { value: 'high_risk', label: 'High Risk' },
        { value: 'suspicious_pattern', label: 'Suspicious Pattern' },
        { value: 'velocity', label: 'Velocity Anomaly' },
        { value: 'mixer', label: 'Mixer Interaction' },
        { value: 'sanctions', label: 'Sanctions' }
      ]
    },
    {
      type: 'range' as const,
      key: 'amount',
      label: 'Amount Range (Rp)',
      min: 0,
      max: 1000000000000
    }
  ]

  const handleSearch = (query: string, searchFilters: Record<string, any>) => {
    setSearchQuery(query)
    setFilters(searchFilters)
  }

  const filteredAlerts = mockAlerts.filter(alert => {
    // Text search
    if (searchQuery && !alert.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !alert.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !alert.walletAddress?.toLowerCase().includes(searchQuery.toLowerCase())) return false
    
    // Filters
    if (filters.severity && filters.severity !== 'all' && alert.severity !== filters.severity) return false
    if (filters.status && filters.status !== 'all' && alert.status !== filters.status) return false
    if (filters.type && filters.type !== 'all' && alert.type !== filters.type) return false
    if (filters.amount && alert.amount) {
      if (filters.amount.min && alert.amount < parseFloat(filters.amount.min)) return false
      if (filters.amount.max && alert.amount > parseFloat(filters.amount.max)) return false
    }
    
    return true
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Alert Center</h1>
            <p className="text-gray-500 mt-1">Monitor dan kelola alert AML/CFT secara real-time</p>
          </div>
          <button 
            onClick={() => alertModal.showAlert({
              type: 'success',
              title: 'Export Berhasil',
              message: 'Data alert telah berhasil diekspor ke format CSV dan akan segera diunduh.'
            })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export Alerts
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Critical</p>
                <p className="text-2xl font-bold text-red-900">
                  {mockAlerts.filter(a => a.severity === 'critical').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">High</p>
                <p className="text-2xl font-bold text-orange-900">
                  {mockAlerts.filter(a => a.severity === 'high').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-400" />
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Medium</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {mockAlerts.filter(a => a.severity === 'medium').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Investigating</p>
                <p className="text-2xl font-bold text-blue-900">
                  {mockAlerts.filter(a => a.status === 'investigating').length}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Advanced Search */}
        <AdvancedSearch
          filters={alertFilters}
          onSearch={handleSearch}
          placeholder="Cari alert berdasarkan judul, deskripsi, wallet address..."
          className="mb-6"
        />

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.map((alert, index) => {
            const Icon = typeIcons[alert.type]
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className={cn(
                      'rounded-xl w-16 h-16 border flex items-center justify-center flex-shrink-0',
                      severityColors[alert.severity]
                    )}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                        <span className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                          statusColors[alert.status]
                        )}>
                          {alert.status === 'new' && 'Baru'}
                          {alert.status === 'investigating' && 'Investigasi'}
                          {alert.status === 'resolved' && 'Selesai'}
                          {alert.status === 'false_positive' && 'False Positive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="font-mono">{alert.id}</span>
                        {alert.walletAddress && (
                          <>
                            <span>•</span>
                            <span className="font-mono">{alert.walletAddress.slice(0, 10)}...{alert.walletAddress.slice(-8)}</span>
                          </>
                        )}
                        {alert.amount && (
                          <>
                            <span>•</span>
                            <span>Rp {(alert.amount / 1000000).toFixed(0)}M</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{format(alert.timestamp, 'dd MMM yyyy HH:mm', { locale: id })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => window.location.href = `/investigation?alert=${alert.id}&wallet=${alert.walletAddress}`}
                      className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Investigasi
                    </button>
                    <button 
                      onClick={() => alertModal.showAlert({
                        type: 'info',
                        title: `Detail Alert ${alert.id}`,
                        message: `${alert.description}\n\nWallet: ${alert.walletAddress}\nWaktu: ${format(alert.timestamp, 'dd MMM yyyy HH:mm', { locale: id })}\nStatus: ${alert.status}`
                      })}
                      className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Detail
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Alert Modal */}
        <AlertModal
          isOpen={alertModal.isOpen}
          onClose={alertModal.close}
          type={alertModal.type}
          title={alertModal.title}
          message={alertModal.message}
          onConfirm={alertModal.onConfirm}
        />
      </div>
    </DashboardLayout>
  )
}